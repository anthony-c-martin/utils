// Weight/volume conversions for common baking ingredients.
//
// Ingredient densities are expressed in grams per millilitre (g/ml). Densities
// for pure liquids use standard physical values. Densities for dry/packed goods
// are derived from the King Arthur Baking Company "Ingredient Weight Chart"
// (https://www.kingarthurbaking.com/learn/ingredient-weight-chart), which
// publishes a gram weight per US cup (1 US cup = 236.588 ml). The density is
// therefore (grams per cup) / 236.588.
//
// e.g. all-purpose flour is 120 g/cup -> 120 / 236.588 = 0.5072 g/ml.

/** Millilitres in one US cup. */
export const ML_PER_CUP = 236.588;

/** Millilitres in one US fluid ounce. */
export const ML_PER_FLOZ = 29.573529;

export type Ingredient = {
  name: string,
  /** Grams per millilitre. */
  density: number,
};

export const ingredients: Ingredient[] = [
  // Pure liquids: standard physical densities.
  { name: 'Water', density: 1.0 },                      // 1.000 g/ml (~20 °C)
  { name: 'Whole milk', density: 1.03 },                // ~1.03 g/ml
  { name: 'Vegetable oil', density: 0.92 },             // ~0.92 g/ml
  { name: 'Honey', density: 1.42 },                     // ~1.42 g/ml
  // Dry / packed goods: King Arthur Ingredient Weight Chart (grams per US cup).
  { name: 'All-purpose flour', density: 120 / ML_PER_CUP },          // 120 g/cup
  { name: 'Bread flour', density: 120 / ML_PER_CUP },                // 120 g/cup
  { name: 'Whole wheat flour', density: 113 / ML_PER_CUP },          // 113 g/cup
  { name: 'Granulated sugar', density: 198 / ML_PER_CUP },           // 198 g/cup
  { name: 'Brown sugar (packed)', density: 213 / ML_PER_CUP },       // 213 g/cup
  { name: "Confectioners' sugar (unsifted)", density: 113 / ML_PER_CUP }, // 113 g/cup
  { name: 'Butter', density: 227 / ML_PER_CUP },                     // 227 g/cup
  { name: 'Unsweetened cocoa powder', density: 85 / ML_PER_CUP },    // 85 g/cup
  { name: 'Table salt', density: 273 / ML_PER_CUP },                 // 273 g/cup
  { name: 'Baking powder', density: 4 / (ML_PER_FLOZ / 6) },         // 4 g/tsp
  { name: 'Baking soda', density: 6 / (ML_PER_FLOZ / 6) },           // 6 g/tsp
];

export const UnitKind = {
  Weight: 'Weight',
  Volume: 'Volume',
} as const;

export type UnitKind = (typeof UnitKind)[keyof typeof UnitKind];

export type Unit = {
  name: string,
  shortName: string,
  kind: UnitKind,
  /** For weight units: grams per unit. For volume units: millilitres per unit. */
  base: number,
};

// US customary volume units are derived from the US fluid ounce.
export const units: Unit[] = [
  { name: 'Grams', shortName: 'g', kind: UnitKind.Weight, base: 1 },
  { name: 'Kilograms', shortName: 'kg', kind: UnitKind.Weight, base: 1000 },
  { name: 'Ounces', shortName: 'oz', kind: UnitKind.Weight, base: 28.349523 },
  { name: 'Pounds', shortName: 'lb', kind: UnitKind.Weight, base: 453.59237 },
  { name: 'Milliliters', shortName: 'ml', kind: UnitKind.Volume, base: 1 },
  { name: 'Fluid Ounces (US)', shortName: 'floz', kind: UnitKind.Volume, base: ML_PER_FLOZ },
  { name: 'Cups (US)', shortName: 'cups', kind: UnitKind.Volume, base: ML_PER_CUP },
  { name: 'Tablespoons (US)', shortName: 'tbsp', kind: UnitKind.Volume, base: ML_PER_FLOZ / 2 },
  { name: 'Teaspoons (US)', shortName: 'tsp', kind: UnitKind.Volume, base: ML_PER_FLOZ / 6 },
];

/** Converts an amount of a given unit into grams for the chosen ingredient. */
export function toGrams(amount: number, unit: Unit, ingredient: Ingredient): number {
  if (unit.kind === UnitKind.Weight) {
    return amount * unit.base;
  }
  // Volume: amount -> millilitres -> grams via density.
  return amount * unit.base * ingredient.density;
}

/** Converts a gram quantity into the given unit for the chosen ingredient. */
export function fromGrams(grams: number, unit: Unit, ingredient: Ingredient): number {
  if (unit.kind === UnitKind.Weight) {
    return grams / unit.base;
  }
  // Grams -> millilitres via density -> unit.
  return grams / ingredient.density / unit.base;
}

/** Converts `amount` of `from` units into `to` units for the given ingredient. */
export function convert(amount: number, from: Unit, to: Unit, ingredient: Ingredient): number {
  return fromGrams(toGrams(amount, from, ingredient), to, ingredient);
}
