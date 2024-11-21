type LatLngTuple = [number, number];

export const cityCenters: Record<string, LatLngTuple> = {
  bangalore: [12.971598123521602, 77.59457003825175],
  delhi: [28.70406, 77.102493],
  hyderabad: [17.4065, 78.4772],
};

export const ZOOM_TO_H3_RES_CORRESPONDENCE: Record<number, number> = {
  5: 1, 6: 2, 7: 3, 8: 3, 9: 4, 10: 5, 11: 6, 12: 6,
  13: 7, 14: 8, 15: 9, 16: 9, 17: 10, 18: 10, 19: 11,
  20: 11, 21: 12, 22: 13, 23: 14, 24: 15,
};

export const colors = ['yellow', 'green', 'red', 'orange', 'purple', 'cyan', 'magenta', 'gray', 'gold', 'silver'];
