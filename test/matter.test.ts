import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CommissioningFlow,
  describeProduct,
  describeVendor,
  parseMatterIdentifier,
  toHex16,
  toManualPairingCode,
} from '../src/helpers/matter.ts';

describe('parseMatterIdentifier', () => {
  it('parses a full payload into its fields', () => {
    const payload = parseMatterIdentifier('MT:ABBB5FPJ01YL2A3C400');
    assert.deepEqual(payload, {
      version: 0,
      vendorId: 4442,
      productId: 53,
      commissioningFlow: CommissioningFlow.Standard,
      discoveryCapabilities: {
        softAp: false,
        ble: true,
        onNetwork: false,
        wifiPaf: false,
        raw: 2,
      },
      discriminator: 2369,
      passcode: 5387248,
      hasTlv: false,
    });
  });

  it('parses each of the sample identifiers consistently', () => {
    const cases = [
      { id: 'MT:G0MB6B-E157SWS5.P10', vendorId: 4874, productId: 121, discriminator: 3325, passcode: 79682463 },
      { id: 'MT:G0MB69DB00WOQT3B910', vendorId: 4874, productId: 121, discriminator: 3072, passcode: 58899496 },
      { id: 'MT:SIST22O614KK.V1P600', vendorId: 4442, productId: 75, discriminator: 3012, passcode: 8297804 },
    ];
    for (const { id, vendorId, productId, discriminator, passcode } of cases) {
      const payload = parseMatterIdentifier(id);
      assert.equal(payload.vendorId, vendorId, id);
      assert.equal(payload.productId, productId, id);
      assert.equal(payload.discriminator, discriminator, id);
      assert.equal(payload.passcode, passcode, id);
      assert.equal(payload.commissioningFlow, CommissioningFlow.Standard, id);
    }
  });

  it('is case-insensitive about the "MT:" prefix and trims whitespace', () => {
    const canonical = parseMatterIdentifier('MT:ABBB5FPJ01YL2A3C400');
    assert.deepEqual(parseMatterIdentifier('  mt:ABBB5FPJ01YL2A3C400  '), canonical);
  });

  it('throws when the "MT:" prefix is missing', () => {
    assert.throws(() => parseMatterIdentifier('ABBB5FPJ01YL2A3C400'), /MT:/);
  });

  it('throws when the payload is too short', () => {
    assert.throws(() => parseMatterIdentifier('MT:AB'), /too short/);
  });

  it('throws on an invalid Base-38 character', () => {
    assert.throws(() => parseMatterIdentifier('MT:@@@@@@@@@@@@@@@@@@@@'), /Base-38/);
  });
});

describe('toManualPairingCode', () => {
  it('derives the 11-digit manual pairing code, grouped 4-3-4', () => {
    const payload = parseMatterIdentifier('MT:ABBB5FPJ01YL2A3C400');
    assert.equal(toManualPairingCode(payload), '2296-800-3287');
  });

  it('matches the manual code for each sample identifier', () => {
    const cases: Record<string, string> = {
      'MT:G0MB6B-E157SWS5.P10': '3070-714-8631',
      'MT:G0MB69DB00WOQT3B910': '3154-003-5946',
      'MT:SIST22O614KK.V1P600': '2566-520-5067',
    };
    for (const [id, expected] of Object.entries(cases)) {
      assert.equal(toManualPairingCode(parseMatterIdentifier(id)), expected, id);
    }
  });
});

describe('toHex16', () => {
  it('formats a value as an uppercase, zero-padded hex string', () => {
    assert.equal(toHex16(0x1049), '0x1049');
    assert.equal(toHex16(53), '0x0035');
    assert.equal(toHex16(0), '0x0000');
  });
});

describe('describeVendor', () => {
  it('returns the name for a known vendor', () => {
    assert.equal(describeVendor(0x115a), 'Nanoleaf');
  });

  it('falls back to the hex id for an unknown vendor', () => {
    assert.equal(describeVendor(0x1234), '0x1234');
  });
});

describe('describeProduct', () => {
  it('falls back to the hex id when the product is unknown', () => {
    assert.equal(describeProduct(0x115a, 53), '0x0035');
  });
});
