console.log('new colors2');

export function dance(beat: number) {
  switch (beat) {
    case 1: return [90 - 20, 90, 90, 90 - 20];
    case 2: return [90 - 20, 90, 90 - 20, 90 - 20];
    case 3:
    case 4: return [90, 90, 90, 90];
    case 5: return [90 + 20, 90 - 15, 90, 90 + 20];
    case 6: return [90 + 20, 90, 90, 90 + 20];
    case 7:
    case 8: return [90, 90, 90, 90];
  }
}

export function floor(beat: number) {
  switch (beat) {
    case 1: return [90 - 20, 90, 90, 90 - 20];
    case 2: return [90, 90, 90, 90];
    case 3:
    case 4: return [90 - 20, 90, 90, 90 - 20];
    case 5: return [90 + 20, 90, 90, 90 + 20];
    case 6: return [90, 90, 90, 90];
    case 7:
    case 8: return [90 + 20, 90, 90, 90 + 20];
  }
}

export function shimmy(beat: number) {
  switch (beat) {
    case 1: return [90 - 20, 90, 90, 90 - 20];
    case 2: return [90, 90, 90, 90];
    case 3:
    case 4: return [90 - 20, 90, 90, 90 - 20];
    case 5: return [90 + 15, 90, 90, 90 - 15];
    case 6: return [90 - 15, 90, 90, 90 + 15];
    case 7:
    case 8: return [90 + 15, 90, 90, 90 - 15];
  }
}

export function merengue(beat: number) {
  switch (beat) {
    case 1: case 5: return [90 + 15, 90, 90, 90 - 15];
    case 2: case 6: return [90 - 15, 90, 90, 90 + 15];
    case 3: case 7: return [90 + 15, 90, 90, 90 - 15];
    case 4: case 8: return [90 - 15, 90, 90, 90 + 15];
  }
}

export function animateBulb(beat: number) {
  return beat % 2 ? { r: 255, g: 0, b: 0 } : { r: 0, g: 255, b: 0 };
}
