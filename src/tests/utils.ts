export const expectEqualIgnoreOrder = (array1: any[], array2: any[]) => {
    expect(array1.sort()).toEqual(array2.sort());
};