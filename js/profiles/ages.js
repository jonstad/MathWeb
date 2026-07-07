export function getAgeProfile(age) {
  if (age === 10) {
    return {
      addMax: 100,
      mulMax: 12,
      percentBase: 100,
      geometryBase: 12,
      trigHypotenuse: 15
    };
  }

  return {
    addMax: 300,
    mulMax: 20,
    percentBase: 250,
    geometryBase: 20,
    trigHypotenuse: 25
  };
}
