import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  convert,
  fromGrams,
  ingredients,
  ML_PER_CUP,
  toGrams,
  UnitKind,
  units,
} from '../src/helpers/baking.ts';
import type { Ingredient, Unit } from '../src/helpers/baking.ts';

function unit(shortName: string): Unit {
  const found = units.find((u) => u.shortName === shortName);
  if (!found) {
    throw new Error(`unknown unit '${shortName}'`);
  }
  return found;
}

function ingredient(name: string): Ingredient {
  const found = ingredients.find((i) => i.name === name);
  if (!found) {
    throw new Error(`unknown ingredient '${name}'`);
  }
  return found;
}

const water = ingredient('Water');
const flour = ingredient('All-purpose flour');

describe('toGrams', () => {
  it('passes weight units straight through in grams', () => {
    assert.equal(toGrams(1, unit('g'), water), 1);
    assert.equal(toGrams(2, unit('kg'), water), 2000);
    assert.equal(toGrams(1, unit('oz'), water), 28.349523);
    assert.equal(toGrams(1, unit('lb'), water), 453.59237);
  });

  it('weight conversions are independent of the ingredient', () => {
    assert.equal(toGrams(1, unit('kg'), water), toGrams(1, unit('kg'), flour));
  });

  it('converts volume to grams using the ingredient density', () => {
    // 1 cup of water = 236.588 ml * 1.0 g/ml.
    assert.equal(toGrams(1, unit('cups'), water), ML_PER_CUP);
    // 1 cup of all-purpose flour is the King Arthur reference weight of 120 g.
    assert.ok(Math.abs(toGrams(1, unit('cups'), flour) - 120) < 1e-9);
  });
});

describe('fromGrams', () => {
  it('passes weight units straight through', () => {
    assert.equal(fromGrams(2000, unit('kg'), water), 2);
    assert.equal(fromGrams(28.349523, unit('oz'), water), 1);
  });

  it('converts grams to volume using the ingredient density', () => {
    assert.ok(Math.abs(fromGrams(ML_PER_CUP, unit('cups'), water) - 1) < 1e-9);
    assert.ok(Math.abs(fromGrams(120, unit('cups'), flour) - 1) < 1e-9);
  });

  it('is the inverse of toGrams', () => {
    for (const ing of ingredients) {
      for (const u of units) {
        const grams = toGrams(3, u, ing);
        assert.ok(Math.abs(fromGrams(grams, u, ing) - 3) < 1e-9, `${ing.name} / ${u.shortName}`);
      }
    }
  });
});

describe('convert', () => {
  it('converts cups of water to grams', () => {
    assert.ok(Math.abs(convert(1, unit('cups'), unit('g'), water) - ML_PER_CUP) < 1e-9);
  });

  it('converts cups of flour to grams (King Arthur reference)', () => {
    assert.ok(Math.abs(convert(1, unit('cups'), unit('g'), flour) - 120) < 1e-9);
  });

  it('converts grams of flour back to cups', () => {
    assert.ok(Math.abs(convert(120, unit('g'), unit('cups'), flour) - 1) < 1e-9);
  });

  it('converts between two volume units independently of ingredient', () => {
    // 1 cup is ~16 tablespoons, and the ratio must not depend on the ingredient.
    const expected = convert(1, unit('cups'), unit('tbsp'), water);
    assert.ok(Math.abs(expected - 16) < 1e-3);
    for (const ing of ingredients) {
      assert.ok(Math.abs(convert(1, unit('cups'), unit('tbsp'), ing) - expected) < 1e-9, ing.name);
    }
  });

  it('converts between two weight units independently of ingredient', () => {
    for (const ing of ingredients) {
      assert.ok(Math.abs(convert(1, unit('kg'), unit('g'), ing) - 1000) < 1e-9, ing.name);
    }
  });

  it('round-trips through an intermediate unit', () => {
    const there = convert(2.5, unit('cups'), unit('oz'), flour);
    const back = convert(there, unit('oz'), unit('cups'), flour);
    assert.ok(Math.abs(back - 2.5) < 1e-9);
  });

  it('has 3 teaspoons per tablespoon', () => {
    assert.ok(Math.abs(convert(1, unit('tbsp'), unit('tsp'), water) - 3) < 1e-9);
  });
});

describe('ingredient data', () => {
  it('uses standard physical density for water', () => {
    assert.equal(water.density, 1.0);
  });

  it('has positive densities for every ingredient', () => {
    for (const ing of ingredients) {
      assert.ok(ing.density > 0, ing.name);
    }
  });

  it('classifies every unit as weight or volume', () => {
    for (const u of units) {
      assert.ok(u.kind === UnitKind.Weight || u.kind === UnitKind.Volume, u.name);
      assert.ok(u.base > 0, u.name);
    }
  });
});

// Reference weight for a known volume of each ingredient. Pure liquids use their
// physical density * volume; dry/packed goods use the King Arthur Ingredient
// Weight Chart figures the helper is built from. Leaveners are quoted per
// teaspoon, matching how they are measured in recipes.
type IngredientCase = {
  amount: number,
  from: string,
  expectedGrams: number,
};

const ingredientCases: Record<string, IngredientCase> = {
  // Pure liquids: density * millilitres per cup.
  'Water': { amount: 1, from: 'cups', expectedGrams: 1.0 * ML_PER_CUP },
  'Whole milk': { amount: 1, from: 'cups', expectedGrams: 1.03 * ML_PER_CUP },
  'Vegetable oil': { amount: 1, from: 'cups', expectedGrams: 0.92 * ML_PER_CUP },
  'Honey': { amount: 1, from: 'cups', expectedGrams: 1.42 * ML_PER_CUP },
  // Dry / packed goods: grams per US cup (King Arthur reference).
  'All-purpose flour': { amount: 1, from: 'cups', expectedGrams: 120 },
  'Bread flour': { amount: 1, from: 'cups', expectedGrams: 120 },
  'Whole wheat flour': { amount: 1, from: 'cups', expectedGrams: 113 },
  'Granulated sugar': { amount: 1, from: 'cups', expectedGrams: 198 },
  'Brown sugar (packed)': { amount: 1, from: 'cups', expectedGrams: 213 },
  "Confectioners' sugar (unsifted)": { amount: 1, from: 'cups', expectedGrams: 113 },
  'Butter': { amount: 1, from: 'cups', expectedGrams: 227 },
  'Unsweetened cocoa powder': { amount: 1, from: 'cups', expectedGrams: 85 },
  'Table salt': { amount: 1, from: 'cups', expectedGrams: 273 },
  // Leaveners: grams per teaspoon.
  'Baking powder': { amount: 1, from: 'tsp', expectedGrams: 4 },
  'Baking soda': { amount: 1, from: 'tsp', expectedGrams: 6 },
};

describe('per-ingredient conversions', () => {
  it('covers every ingredient defined in the helper', () => {
    const defined = ingredients.map((i) => i.name).sort();
    const tested = Object.keys(ingredientCases).sort();
    assert.deepEqual(tested, defined);
  });

  for (const ing of ingredients) {
    describe(ing.name, () => {
      const { amount, from, expectedGrams } = ingredientCases[ing.name];

      it(`converts ${amount} ${from} to the reference weight in grams`, () => {
        const grams = convert(amount, unit(from), unit('g'), ing);
        assert.ok(
          Math.abs(grams - expectedGrams) < 1e-9,
          `expected ${expectedGrams} g, got ${grams} g`,
        );
      });

      it('converts that weight back to the original volume', () => {
        const volume = convert(expectedGrams, unit('g'), unit(from), ing);
        assert.ok(Math.abs(volume - amount) < 1e-9, `expected ${amount} ${from}, got ${volume}`);
      });

      it('scales linearly with the amount', () => {
        const single = convert(amount, unit(from), unit('g'), ing);
        const triple = convert(amount * 3, unit(from), unit('g'), ing);
        assert.ok(Math.abs(triple - single * 3) < 1e-9);
      });

      it('agrees with the raw density (grams = millilitres * density)', () => {
        const grams = convert(1, unit(from), unit('g'), ing);
        const millilitres = convert(1, unit(from), unit('ml'), ing);
        assert.ok(Math.abs(grams - millilitres * ing.density) < 1e-9);
      });
    });
  }
});

