// Parser for Matter (formerly Project CHIP) onboarding payloads, i.e. the
// "MT:..." device identifiers found in QR codes on Matter smart-home devices.
//
// The payload after the "MT:" prefix is a Base-38 encoded, bit-packed binary
// structure as defined by the Matter specification (section 5.1, "Onboarding
// Payload"). This module decodes it back into its individual fields.

const BASE38_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-.';

// Number of Base-38 characters used to encode a chunk of 1, 2 or 3 bytes.
const CHARS_FOR_BYTES = [0, 2, 4, 5];

export enum CommissioningFlow {
  Standard = 'Standard',
  UserIntent = 'User-intent',
  Custom = 'Custom',
  Reserved = 'Reserved',
}

export type DiscoveryCapabilities = {
  softAp: boolean;
  ble: boolean;
  onNetwork: boolean;
  wifiPaf: boolean;
  raw: number;
};

export type MatterPayload = {
  version: number;
  vendorId: number;
  productId: number;
  commissioningFlow: CommissioningFlow;
  discoveryCapabilities: DiscoveryCapabilities;
  discriminator: number;
  passcode: number;
  /** Any bytes beyond the 88-bit core payload, i.e. optional TLV data. */
  hasTlv: boolean;
};

/** Decodes a Matter Base-38 string into its underlying bytes. */
function base38Decode(encoded: string): Uint8Array {
  const bytes: number[] = [];

  for (let offset = 0; offset < encoded.length; ) {
    const remaining = encoded.length - offset;
    let charsInChunk: number;
    let bytesInChunk: number;

    if (remaining >= 5) {
      charsInChunk = 5;
      bytesInChunk = 3;
    } else if (remaining === 4) {
      charsInChunk = 4;
      bytesInChunk = 2;
    } else if (remaining === 2) {
      charsInChunk = 2;
      bytesInChunk = 1;
    } else {
      throw new Error(`Invalid Base-38 length: dangling ${remaining} character(s)`);
    }

    // Characters are least-significant first within a chunk.
    let value = 0;
    for (let i = charsInChunk - 1; i >= 0; i--) {
      const digit = BASE38_ALPHABET.indexOf(encoded[offset + i]);
      if (digit < 0) {
        throw new Error(`Invalid Base-38 character: '${encoded[offset + i]}'`);
      }
      value = value * 38 + digit;
    }

    if (charsInChunk !== CHARS_FOR_BYTES[bytesInChunk]) {
      throw new Error('Invalid Base-38 chunk');
    }

    // Bytes are emitted little-endian.
    for (let i = 0; i < bytesInChunk; i++) {
      bytes.push((value >> (8 * i)) & 0xff);
    }

    offset += charsInChunk;
  }

  return Uint8Array.from(bytes);
}

/** Reads `length` bits at `offset` from a little-endian bit stream. */
function readBits(bytes: Uint8Array, offset: number, length: number): number {
  let value = 0;
  for (let i = 0; i < length; i++) {
    const bitIndex = offset + i;
    const byte = bytes[bitIndex >> 3] ?? 0;
    const bit = (byte >> (bitIndex & 7)) & 1;
    value |= bit << i;
  }
  // `>>> 0` keeps the result as an unsigned 32-bit integer.
  return value >>> 0;
}

const COMMISSIONING_FLOWS = [
  CommissioningFlow.Standard,
  CommissioningFlow.UserIntent,
  CommissioningFlow.Custom,
  CommissioningFlow.Reserved,
];

/**
 * Parses a Matter device identifier such as
 * `MT:G0MB6B-E157SWS5.P10` into its individual fields.
 *
 * @throws if the identifier is not a well-formed Matter onboarding payload.
 */
export function parseMatterIdentifier(identifier: string): MatterPayload {
  const trimmed = identifier.trim();
  if (!trimmed.toUpperCase().startsWith('MT:')) {
    throw new Error('Not a Matter identifier: expected an "MT:" prefix');
  }

  const bytes = base38Decode(trimmed.slice(3));
  if (bytes.length < 11) {
    throw new Error('Payload too short to be a valid Matter identifier');
  }

  // Field layout (little-endian bit stream), total 88 bits:
  //   version                 3 bits
  //   vendor id              16 bits
  //   product id             16 bits
  //   commissioning flow      2 bits
  //   discovery capabilities  8 bits
  //   discriminator          12 bits
  //   passcode               27 bits
  //   padding                 4 bits
  let bit = 0;
  const next = (length: number) => {
    const value = readBits(bytes, bit, length);
    bit += length;
    return value;
  };

  const version = next(3);
  const vendorId = next(16);
  const productId = next(16);
  const flow = next(2);
  const capabilities = next(8);
  const discriminator = next(12);
  const passcode = next(27);

  return {
    version,
    vendorId,
    productId,
    commissioningFlow: COMMISSIONING_FLOWS[flow],
    discoveryCapabilities: {
      softAp: (capabilities & 0b0001) !== 0,
      ble: (capabilities & 0b0010) !== 0,
      onNetwork: (capabilities & 0b0100) !== 0,
      wifiPaf: (capabilities & 0b1000) !== 0,
      raw: capabilities,
    },
    discriminator,
    passcode,
    hasTlv: bytes.length > 11,
  };
}

/** Formats a 16-bit id as an uppercase, zero-padded hex string (e.g. `0xFFF1`). */
export function toHex16(value: number): string {
  return `0x${value.toString(16).toUpperCase().padStart(4, '0')}`;
}

// Verhoeff checksum tables, used to compute the trailing check digit of a
// Matter manual pairing code.
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 9, 1, 2, 3, 4, 6, 7],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
const VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/** Computes the Verhoeff check digit for a string of decimal digits. */
function verhoeffCheckDigit(digits: string): number {
  let c = 0;
  const reversed = digits.split('').reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][Number(reversed[i])]];
  }
  return VERHOEFF_INV[c];
}

/**
 * Derives the human-typable manual pairing code from a decoded payload, e.g.
 * `2296-800-3287`. The code encodes the short discriminator and passcode, plus
 * the vendor/product ids when the device does not use the standard
 * commissioning flow, followed by a Verhoeff check digit.
 */
export function toManualPairingCode(payload: MatterPayload): string {
  const shortDiscriminator = (payload.discriminator >> 8) & 0xf;
  const vidPidPresent = payload.commissioningFlow !== CommissioningFlow.Standard;

  let digits =
    String((Number(vidPidPresent) << 2) | (shortDiscriminator >> 2)) +
    String(((shortDiscriminator & 0x3) << 14) | (payload.passcode & 0x3fff)).padStart(5, '0') +
    String((payload.passcode >> 14) & 0x1fff).padStart(4, '0');

  if (vidPidPresent) {
    digits +=
      String(payload.vendorId).padStart(5, '0') +
      String(payload.productId).padStart(5, '0');
  }

  digits += String(verhoeffCheckDigit(digits));

  // Standard 11-digit code is displayed grouped as 4-3-4.
  if (digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return digits;
}

// A small, hand-maintained lookup of well-known Matter vendors and products.
//
// Vendor IDs are assigned by the Connectivity Standards Alliance (CSA); the
// authoritative source is the Distributed Compliance Ledger (DCL). This table
// only covers a handful of common vendors — extend it as needed. Anything not
// listed here falls back to showing the raw id.

type VendorInfo = {
  name: string;
  /** Optional map of product id -> product name for this vendor. */
  products?: Record<number, string>;
};

const MATTER_VENDORS: Record<number, VendorInfo> = {
  0x130a: { name: 'Eve Systems' },
  0x115a: { name: 'Nanoleaf' },
  0x1387: { name: 'Govee' },
  0x1391: { name: 'TP-Link' },
  0x143d: { name: 'Onvis' },
};

/**
 * Returns a human-friendly description of a vendor id, e.g.
 * `Google LLC (0x1049)`, falling back to `0x1234 (4660)` when unknown.
 */
export function describeVendor(vendorId: number): string {
  const vendor = MATTER_VENDORS[vendorId];
  if (vendor) {
    return vendor.name;
  }
  return toHex16(vendorId);
}

/**
 * Returns a human-friendly description of a product id, e.g.
 * `Kitchen Bulb (0x0035)`, falling back to `0x0035 (53)` when unknown.
 */
export function describeProduct(vendorId: number, productId: number): string {
  const product = MATTER_VENDORS[vendorId]?.products?.[productId];
  if (product) {
    return product;
  }
  return toHex16(productId);
}
