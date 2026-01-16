/**
 * 管道规格表 - 完整静态版本
 * 支持两种标准:
 * - 公制 (GB/T) - 默认
 * - 英制 (ASME B36.10M)
 */
/**
 * 完整的管道规格数据（270条记录）
 * 格式: 'DN-SCH': PipeSpec
 */
export const PIPE_SPECS_DATA = {
    // DN=6 (1/8")
    '6-40': { dn: 6, outerDiameter: 10.3, schStandard: '40', wallThickness: 1.73, innerDiameter: 6.84 },
    '6-80': { dn: 6, outerDiameter: 10.3, schStandard: '80', wallThickness: 2.41, innerDiameter: 5.48 },
    '6-STD': { dn: 6, outerDiameter: 10.3, schStandard: 'STD', wallThickness: 1.73, innerDiameter: 6.84 },
    '6-XS': { dn: 6, outerDiameter: 10.3, schStandard: 'XS', wallThickness: 2.41, innerDiameter: 5.48 },
    '6-10S': { dn: 6, outerDiameter: 10.3, schStandard: '10S', wallThickness: 1.24, innerDiameter: 7.82 },
    '6-40S': { dn: 6, outerDiameter: 10.3, schStandard: '40S', wallThickness: 1.73, innerDiameter: 6.84 },
    '6-80S': { dn: 6, outerDiameter: 10.3, schStandard: '80S', wallThickness: 2.41, innerDiameter: 5.48 },
    // DN=8 (1/4")
    '8-40': { dn: 8, outerDiameter: 13.7, schStandard: '40', wallThickness: 2.24, innerDiameter: 9.22 },
    '8-80': { dn: 8, outerDiameter: 13.7, schStandard: '80', wallThickness: 3.02, innerDiameter: 7.66 },
    '8-STD': { dn: 8, outerDiameter: 13.7, schStandard: 'STD', wallThickness: 2.24, innerDiameter: 9.22 },
    '8-XS': { dn: 8, outerDiameter: 13.7, schStandard: 'XS', wallThickness: 3.02, innerDiameter: 7.66 },
    '8-10S': { dn: 8, outerDiameter: 13.7, schStandard: '10S', wallThickness: 1.65, innerDiameter: 10.4 },
    '8-40S': { dn: 8, outerDiameter: 13.7, schStandard: '40S', wallThickness: 2.24, innerDiameter: 9.22 },
    '8-80S': { dn: 8, outerDiameter: 13.7, schStandard: '80S', wallThickness: 3.02, innerDiameter: 7.66 },
    // DN=10 (3/8")
    '10-40': { dn: 10, outerDiameter: 17.2, schStandard: '40', wallThickness: 2.31, innerDiameter: 12.58 },
    '10-80': { dn: 10, outerDiameter: 17.2, schStandard: '80', wallThickness: 3.32, innerDiameter: 10.56 },
    '10-STD': { dn: 10, outerDiameter: 17.2, schStandard: 'STD', wallThickness: 2.31, innerDiameter: 12.58 },
    '10-XS': { dn: 10, outerDiameter: 17.2, schStandard: 'XS', wallThickness: 3.32, innerDiameter: 10.56 },
    '10-10S': { dn: 10, outerDiameter: 17.2, schStandard: '10S', wallThickness: 1.65, innerDiameter: 13.9 },
    '10-20S': { dn: 10, outerDiameter: 17.2, schStandard: '20S', wallThickness: 2, innerDiameter: 13.2 },
    '10-40S': { dn: 10, outerDiameter: 17.2, schStandard: '40S', wallThickness: 2.31, innerDiameter: 12.58 },
    '10-80S': { dn: 10, outerDiameter: 17.2, schStandard: '80S', wallThickness: 3.32, innerDiameter: 10.56 },
    // DN=15 (1/2")
    '15-40': { dn: 15, outerDiameter: 21.3, schStandard: '40', wallThickness: 2.77, innerDiameter: 15.76 },
    '15-80': { dn: 15, outerDiameter: 21.3, schStandard: '80', wallThickness: 3.73, innerDiameter: 13.84 },
    '15-160': { dn: 15, outerDiameter: 21.3, schStandard: '160', wallThickness: 4.78, innerDiameter: 11.74 },
    '15-STD': { dn: 15, outerDiameter: 21.3, schStandard: 'STD', wallThickness: 2.77, innerDiameter: 15.76 },
    '15-XS': { dn: 15, outerDiameter: 21.3, schStandard: 'XS', wallThickness: 3.73, innerDiameter: 13.84 },
    '15-XXS': { dn: 15, outerDiameter: 21.3, schStandard: 'XXS', wallThickness: 7.47, innerDiameter: 6.36 },
    '15-5S': { dn: 15, outerDiameter: 21.3, schStandard: '5S', wallThickness: 1.65, innerDiameter: 18 },
    '15-10S': { dn: 15, outerDiameter: 21.3, schStandard: '10S', wallThickness: 2.11, innerDiameter: 17.08 },
    '15-20S': { dn: 15, outerDiameter: 21.3, schStandard: '20S', wallThickness: 2.5, innerDiameter: 16.3 },
    '15-40S': { dn: 15, outerDiameter: 21.3, schStandard: '40S', wallThickness: 2.77, innerDiameter: 15.76 },
    '15-80S': { dn: 15, outerDiameter: 21.3, schStandard: '80S', wallThickness: 3.73, innerDiameter: 13.84 },
    // DN=20 (3/4")
    '20-40': { dn: 20, outerDiameter: 26.9, schStandard: '40', wallThickness: 2.87, innerDiameter: 21.16 },
    '20-80': { dn: 20, outerDiameter: 26.9, schStandard: '80', wallThickness: 3.91, innerDiameter: 19.08 },
    '20-160': { dn: 20, outerDiameter: 26.9, schStandard: '160', wallThickness: 5.56, innerDiameter: 15.78 },
    '20-STD': { dn: 20, outerDiameter: 26.9, schStandard: 'STD', wallThickness: 2.87, innerDiameter: 21.16 },
    '20-XS': { dn: 20, outerDiameter: 26.9, schStandard: 'XS', wallThickness: 3.91, innerDiameter: 19.08 },
    '20-XXS': { dn: 20, outerDiameter: 26.9, schStandard: 'XXS', wallThickness: 7.82, innerDiameter: 11.26 },
    '20-5S': { dn: 20, outerDiameter: 26.9, schStandard: '5S', wallThickness: 1.65, innerDiameter: 23.6 },
    '20-10S': { dn: 20, outerDiameter: 26.9, schStandard: '10S', wallThickness: 2.11, innerDiameter: 22.68 },
    '20-20S': { dn: 20, outerDiameter: 26.9, schStandard: '20S', wallThickness: 2.5, innerDiameter: 21.9 },
    '20-40S': { dn: 20, outerDiameter: 26.9, schStandard: '40S', wallThickness: 2.87, innerDiameter: 21.16 },
    '20-80S': { dn: 20, outerDiameter: 26.9, schStandard: '80S', wallThickness: 3.91, innerDiameter: 19.08 },
    // DN=25 (1")
    '25-40': { dn: 25, outerDiameter: 33.7, schStandard: '40', wallThickness: 3.38, innerDiameter: 26.94 },
    '25-80': { dn: 25, outerDiameter: 33.7, schStandard: '80', wallThickness: 4.55, innerDiameter: 24.6 },
    '25-160': { dn: 25, outerDiameter: 33.7, schStandard: '160', wallThickness: 6.35, innerDiameter: 21 },
    '25-STD': { dn: 25, outerDiameter: 33.7, schStandard: 'STD', wallThickness: 3.38, innerDiameter: 26.94 },
    '25-XS': { dn: 25, outerDiameter: 33.7, schStandard: 'XS', wallThickness: 4.55, innerDiameter: 24.6 },
    '25-XXS': { dn: 25, outerDiameter: 33.7, schStandard: 'XXS', wallThickness: 9.09, innerDiameter: 15.52 },
    '25-5S': { dn: 25, outerDiameter: 33.7, schStandard: '5S', wallThickness: 1.65, innerDiameter: 30.4 },
    '25-10S': { dn: 25, outerDiameter: 33.7, schStandard: '10S', wallThickness: 2.77, innerDiameter: 28.16 },
    '25-20S': { dn: 25, outerDiameter: 33.7, schStandard: '20S', wallThickness: 3, innerDiameter: 27.7 },
    '25-40S': { dn: 25, outerDiameter: 33.7, schStandard: '40S', wallThickness: 3.38, innerDiameter: 26.94 },
    '25-80S': { dn: 25, outerDiameter: 33.7, schStandard: '80S', wallThickness: 4.55, innerDiameter: 24.6 },
    // DN=32 (1-1/4")
    '32-40': { dn: 32, outerDiameter: 42.4, schStandard: '40', wallThickness: 3.56, innerDiameter: 35.28 },
    '32-80': { dn: 32, outerDiameter: 42.4, schStandard: '80', wallThickness: 4.85, innerDiameter: 32.7 },
    '32-160': { dn: 32, outerDiameter: 42.4, schStandard: '160', wallThickness: 6.35, innerDiameter: 29.7 },
    '32-STD': { dn: 32, outerDiameter: 42.4, schStandard: 'STD', wallThickness: 3.56, innerDiameter: 35.28 },
    '32-XS': { dn: 32, outerDiameter: 42.4, schStandard: 'XS', wallThickness: 4.85, innerDiameter: 32.7 },
    '32-XXS': { dn: 32, outerDiameter: 42.4, schStandard: 'XXS', wallThickness: 9.7, innerDiameter: 23 },
    '32-5S': { dn: 32, outerDiameter: 42.4, schStandard: '5S', wallThickness: 1.65, innerDiameter: 39.1 },
    '32-10S': { dn: 32, outerDiameter: 42.4, schStandard: '10S', wallThickness: 2.77, innerDiameter: 36.86 },
    '32-20S': { dn: 32, outerDiameter: 42.4, schStandard: '20S', wallThickness: 3, innerDiameter: 36.4 },
    '32-40S': { dn: 32, outerDiameter: 42.4, schStandard: '40S', wallThickness: 3.56, innerDiameter: 35.28 },
    '32-80S': { dn: 32, outerDiameter: 42.4, schStandard: '80S', wallThickness: 4.85, innerDiameter: 32.7 },
    // DN=40 (1-1/2")
    '40-40': { dn: 40, outerDiameter: 48.3, schStandard: '40', wallThickness: 3.68, innerDiameter: 40.94 },
    '40-80': { dn: 40, outerDiameter: 48.3, schStandard: '80', wallThickness: 5.08, innerDiameter: 38.14 },
    '40-160': { dn: 40, outerDiameter: 48.3, schStandard: '160', wallThickness: 7.14, innerDiameter: 34.02 },
    '40-STD': { dn: 40, outerDiameter: 48.3, schStandard: 'STD', wallThickness: 3.68, innerDiameter: 40.94 },
    '40-XS': { dn: 40, outerDiameter: 48.3, schStandard: 'XS', wallThickness: 5.08, innerDiameter: 38.14 },
    '40-XXS': { dn: 40, outerDiameter: 48.3, schStandard: 'XXS', wallThickness: 10.15, innerDiameter: 28 },
    '40-5S': { dn: 40, outerDiameter: 48.3, schStandard: '5S', wallThickness: 1.65, innerDiameter: 45 },
    '40-10S': { dn: 40, outerDiameter: 48.3, schStandard: '10S', wallThickness: 2.77, innerDiameter: 42.76 },
    '40-20S': { dn: 40, outerDiameter: 48.3, schStandard: '20S', wallThickness: 3, innerDiameter: 42.3 },
    '40-40S': { dn: 40, outerDiameter: 48.3, schStandard: '40S', wallThickness: 3.68, innerDiameter: 40.94 },
    '40-80S': { dn: 40, outerDiameter: 48.3, schStandard: '80S', wallThickness: 5.08, innerDiameter: 38.14 },
    // DN=50 (2") - 最常用
    '50-40': { dn: 50, outerDiameter: 60.3, schStandard: '40', wallThickness: 3.91, innerDiameter: 52.48 },
    '50-80': { dn: 50, outerDiameter: 60.3, schStandard: '80', wallThickness: 5.54, innerDiameter: 49.22 },
    '50-160': { dn: 50, outerDiameter: 60.3, schStandard: '160', wallThickness: 8.74, innerDiameter: 42.82 },
    '50-STD': { dn: 50, outerDiameter: 60.3, schStandard: 'STD', wallThickness: 3.91, innerDiameter: 52.48 },
    '50-XS': { dn: 50, outerDiameter: 60.3, schStandard: 'XS', wallThickness: 5.54, innerDiameter: 49.22 },
    '50-XXS': { dn: 50, outerDiameter: 60.3, schStandard: 'XXS', wallThickness: 11.07, innerDiameter: 38.16 },
    '50-5S': { dn: 50, outerDiameter: 60.3, schStandard: '5S', wallThickness: 1.65, innerDiameter: 57 },
    '50-10S': { dn: 50, outerDiameter: 60.3, schStandard: '10S', wallThickness: 2.77, innerDiameter: 54.76 },
    '50-20S': { dn: 50, outerDiameter: 60.3, schStandard: '20S', wallThickness: 3.5, innerDiameter: 53.3 },
    '50-40S': { dn: 50, outerDiameter: 60.3, schStandard: '40S', wallThickness: 3.91, innerDiameter: 52.48 },
    '50-80S': { dn: 50, outerDiameter: 60.3, schStandard: '80S', wallThickness: 5.54, innerDiameter: 49.22 },
    // DN=65 (2-1/2")
    '65-40': { dn: 65, outerDiameter: 76.1, schStandard: '40', wallThickness: 5.16, innerDiameter: 65.78 },
    '65-80': { dn: 65, outerDiameter: 76.1, schStandard: '80', wallThickness: 7.01, innerDiameter: 62.08 },
    '65-160': { dn: 65, outerDiameter: 76.1, schStandard: '160', wallThickness: 9.53, innerDiameter: 57.04 },
    '65-STD': { dn: 65, outerDiameter: 76.1, schStandard: 'STD', wallThickness: 5.16, innerDiameter: 65.78 },
    '65-XS': { dn: 65, outerDiameter: 76.1, schStandard: 'XS', wallThickness: 7.01, innerDiameter: 62.08 },
    '65-XXS': { dn: 65, outerDiameter: 76.1, schStandard: 'XXS', wallThickness: 14.02, innerDiameter: 48.06 },
    '65-5S': { dn: 65, outerDiameter: 76.1, schStandard: '5S', wallThickness: 2.11, innerDiameter: 71.88 },
    '65-10S': { dn: 65, outerDiameter: 76.1, schStandard: '10S', wallThickness: 3.05, innerDiameter: 70 },
    '65-20S': { dn: 65, outerDiameter: 76.1, schStandard: '20S', wallThickness: 3.5, innerDiameter: 69.1 },
    '65-40S': { dn: 65, outerDiameter: 76.1, schStandard: '40S', wallThickness: 5.16, innerDiameter: 65.78 },
    '65-80S': { dn: 65, outerDiameter: 76.1, schStandard: '80S', wallThickness: 7.01, innerDiameter: 62.08 },
    // DN=80 (3")
    '80-40': { dn: 80, outerDiameter: 88.9, schStandard: '40', wallThickness: 5.49, innerDiameter: 77.92 },
    '80-80': { dn: 80, outerDiameter: 88.9, schStandard: '80', wallThickness: 7.62, innerDiameter: 73.66 },
    '80-160': { dn: 80, outerDiameter: 88.9, schStandard: '160', wallThickness: 11.13, innerDiameter: 66.64 },
    '80-STD': { dn: 80, outerDiameter: 88.9, schStandard: 'STD', wallThickness: 5.49, innerDiameter: 77.92 },
    '80-XS': { dn: 80, outerDiameter: 88.9, schStandard: 'XS', wallThickness: 7.62, innerDiameter: 73.66 },
    '80-XXS': { dn: 80, outerDiameter: 88.9, schStandard: 'XXS', wallThickness: 15.24, innerDiameter: 58.42 },
    '80-5S': { dn: 80, outerDiameter: 88.9, schStandard: '5S', wallThickness: 2.11, innerDiameter: 84.68 },
    '80-10S': { dn: 80, outerDiameter: 88.9, schStandard: '10S', wallThickness: 3.05, innerDiameter: 82.8 },
    '80-20S': { dn: 80, outerDiameter: 88.9, schStandard: '20S', wallThickness: 4, innerDiameter: 80.9 },
    '80-40S': { dn: 80, outerDiameter: 88.9, schStandard: '40S', wallThickness: 5.49, innerDiameter: 77.92 },
    '80-80S': { dn: 80, outerDiameter: 88.9, schStandard: '80S', wallThickness: 7.62, innerDiameter: 73.66 },
    // DN=100 (4")
    '100-40': { dn: 100, outerDiameter: 114.3, schStandard: '40', wallThickness: 6.02, innerDiameter: 102.26 },
    '100-80': { dn: 100, outerDiameter: 114.3, schStandard: '80', wallThickness: 8.56, innerDiameter: 97.18 },
    '100-120': { dn: 100, outerDiameter: 114.3, schStandard: '120', wallThickness: 11.13, innerDiameter: 92.04 },
    '100-160': { dn: 100, outerDiameter: 114.3, schStandard: '160', wallThickness: 13.49, innerDiameter: 87.32 },
    '100-STD': { dn: 100, outerDiameter: 114.3, schStandard: 'STD', wallThickness: 6.02, innerDiameter: 102.26 },
    '100-XS': { dn: 100, outerDiameter: 114.3, schStandard: 'XS', wallThickness: 8.56, innerDiameter: 97.18 },
    '100-XXS': { dn: 100, outerDiameter: 114.3, schStandard: 'XXS', wallThickness: 17.12, innerDiameter: 80.06 },
    '100-5S': { dn: 100, outerDiameter: 114.3, schStandard: '5S', wallThickness: 2.11, innerDiameter: 110.08 },
    '100-10S': { dn: 100, outerDiameter: 114.3, schStandard: '10S', wallThickness: 3.05, innerDiameter: 108.2 },
    '100-20S': { dn: 100, outerDiameter: 114.3, schStandard: '20S', wallThickness: 4, innerDiameter: 106.3 },
    '100-40S': { dn: 100, outerDiameter: 114.3, schStandard: '40S', wallThickness: 6.02, innerDiameter: 102.26 },
    '100-80S': { dn: 100, outerDiameter: 114.3, schStandard: '80S', wallThickness: 8.56, innerDiameter: 97.18 },
    // DN=125 (5")
    '125-40': { dn: 125, outerDiameter: 139.7, schStandard: '40', wallThickness: 6.55, innerDiameter: 126.6 },
    '125-80': { dn: 125, outerDiameter: 139.7, schStandard: '80', wallThickness: 9.53, innerDiameter: 120.64 },
    '125-120': { dn: 125, outerDiameter: 139.7, schStandard: '120', wallThickness: 12.7, innerDiameter: 114.3 },
    '125-160': { dn: 125, outerDiameter: 139.7, schStandard: '160', wallThickness: 15.88, innerDiameter: 107.94 },
    '125-STD': { dn: 125, outerDiameter: 139.7, schStandard: 'STD', wallThickness: 6.55, innerDiameter: 126.6 },
    '125-XS': { dn: 125, outerDiameter: 139.7, schStandard: 'XS', wallThickness: 9.53, innerDiameter: 120.64 },
    '125-XXS': { dn: 125, outerDiameter: 139.7, schStandard: 'XXS', wallThickness: 19.05, innerDiameter: 101.6 },
    '125-5S': { dn: 125, outerDiameter: 139.7, schStandard: '5S', wallThickness: 2.77, innerDiameter: 134.16 },
    '125-10S': { dn: 125, outerDiameter: 139.7, schStandard: '10S', wallThickness: 3.4, innerDiameter: 132.9 },
    '125-20S': { dn: 125, outerDiameter: 139.7, schStandard: '20S', wallThickness: 5, innerDiameter: 129.7 },
    '125-40S': { dn: 125, outerDiameter: 139.7, schStandard: '40S', wallThickness: 6.55, innerDiameter: 126.6 },
    '125-80S': { dn: 125, outerDiameter: 139.7, schStandard: '80S', wallThickness: 9.53, innerDiameter: 120.64 },
    // DN=150 (6")
    '150-40': { dn: 150, outerDiameter: 168.3, schStandard: '40', wallThickness: 7.11, innerDiameter: 154.08 },
    '150-80': { dn: 150, outerDiameter: 168.3, schStandard: '80', wallThickness: 10.97, innerDiameter: 146.36 },
    '150-120': { dn: 150, outerDiameter: 168.3, schStandard: '120', wallThickness: 14.27, innerDiameter: 139.76 },
    '150-160': { dn: 150, outerDiameter: 168.3, schStandard: '160', wallThickness: 18.26, innerDiameter: 131.78 },
    '150-STD': { dn: 150, outerDiameter: 168.3, schStandard: 'STD', wallThickness: 7.11, innerDiameter: 154.08 },
    '150-XS': { dn: 150, outerDiameter: 168.3, schStandard: 'XS', wallThickness: 10.97, innerDiameter: 146.36 },
    '150-XXS': { dn: 150, outerDiameter: 168.3, schStandard: 'XXS', wallThickness: 21.95, innerDiameter: 124.4 },
    '150-5S': { dn: 150, outerDiameter: 168.3, schStandard: '5S', wallThickness: 2.77, innerDiameter: 162.76 },
    '150-10S': { dn: 150, outerDiameter: 168.3, schStandard: '10S', wallThickness: 3.4, innerDiameter: 161.5 },
    '150-20S': { dn: 150, outerDiameter: 168.3, schStandard: '20S', wallThickness: 5, innerDiameter: 158.3 },
    '150-40S': { dn: 150, outerDiameter: 168.3, schStandard: '40S', wallThickness: 7.11, innerDiameter: 154.08 },
    '150-80S': { dn: 150, outerDiameter: 168.3, schStandard: '80S', wallThickness: 10.97, innerDiameter: 146.36 },
    // DN=200 (8")
    '200-20': { dn: 200, outerDiameter: 219.1, schStandard: '20', wallThickness: 6.35, innerDiameter: 206.4 },
    '200-30': { dn: 200, outerDiameter: 219.1, schStandard: '30', wallThickness: 7.04, innerDiameter: 205.02 },
    '200-40': { dn: 200, outerDiameter: 219.1, schStandard: '40', wallThickness: 8.18, innerDiameter: 202.74 },
    '200-60': { dn: 200, outerDiameter: 219.1, schStandard: '60', wallThickness: 10.31, innerDiameter: 198.48 },
    '200-80': { dn: 200, outerDiameter: 219.1, schStandard: '80', wallThickness: 12.7, innerDiameter: 193.7 },
    '200-100': { dn: 200, outerDiameter: 219.1, schStandard: '100', wallThickness: 15.09, innerDiameter: 188.92 },
    '200-120': { dn: 200, outerDiameter: 219.1, schStandard: '120', wallThickness: 18.26, innerDiameter: 182.58 },
    '200-140': { dn: 200, outerDiameter: 219.1, schStandard: '140', wallThickness: 20.62, innerDiameter: 177.86 },
    '200-160': { dn: 200, outerDiameter: 219.1, schStandard: '160', wallThickness: 23.01, innerDiameter: 173.08 },
    '200-STD': { dn: 200, outerDiameter: 219.1, schStandard: 'STD', wallThickness: 8.18, innerDiameter: 202.74 },
    '200-XS': { dn: 200, outerDiameter: 219.1, schStandard: 'XS', wallThickness: 12.7, innerDiameter: 193.7 },
    '200-XXS': { dn: 200, outerDiameter: 219.1, schStandard: 'XXS', wallThickness: 22.23, innerDiameter: 174.64 },
    '200-5S': { dn: 200, outerDiameter: 219.1, schStandard: '5S', wallThickness: 2.77, innerDiameter: 213.56 },
    '200-10S': { dn: 200, outerDiameter: 219.1, schStandard: '10S', wallThickness: 3.76, innerDiameter: 211.58 },
    '200-20S': { dn: 200, outerDiameter: 219.1, schStandard: '20S', wallThickness: 6.5, innerDiameter: 206.1 },
    '200-40S': { dn: 200, outerDiameter: 219.1, schStandard: '40S', wallThickness: 8.18, innerDiameter: 202.74 },
    '200-80S': { dn: 200, outerDiameter: 219.1, schStandard: '80S', wallThickness: 12.7, innerDiameter: 193.7 },
    // DN=250 (10")
    '250-20': { dn: 250, outerDiameter: 273, schStandard: '20', wallThickness: 6.35, innerDiameter: 260.3 },
    '250-30': { dn: 250, outerDiameter: 273, schStandard: '30', wallThickness: 7.8, innerDiameter: 257.4 },
    '250-40': { dn: 250, outerDiameter: 273, schStandard: '40', wallThickness: 9.27, innerDiameter: 254.46 },
    '250-60': { dn: 250, outerDiameter: 273, schStandard: '60', wallThickness: 12.7, innerDiameter: 247.6 },
    '250-80': { dn: 250, outerDiameter: 273, schStandard: '80', wallThickness: 15.09, innerDiameter: 242.82 },
    '250-100': { dn: 250, outerDiameter: 273, schStandard: '100', wallThickness: 18.26, innerDiameter: 236.48 },
    '250-120': { dn: 250, outerDiameter: 273, schStandard: '120', wallThickness: 21.44, innerDiameter: 230.12 },
    '250-140': { dn: 250, outerDiameter: 273, schStandard: '140', wallThickness: 25.4, innerDiameter: 222.2 },
    '250-160': { dn: 250, outerDiameter: 273, schStandard: '160', wallThickness: 28.58, innerDiameter: 215.84 },
    '250-STD': { dn: 250, outerDiameter: 273, schStandard: 'STD', wallThickness: 9.27, innerDiameter: 254.46 },
    '250-XS': { dn: 250, outerDiameter: 273, schStandard: 'XS', wallThickness: 12.7, innerDiameter: 247.6 },
    '250-XXS': { dn: 250, outerDiameter: 273, schStandard: 'XXS', wallThickness: 25.4, innerDiameter: 222.2 },
    '250-5S': { dn: 250, outerDiameter: 273, schStandard: '5S', wallThickness: 3.4, innerDiameter: 266.2 },
    '250-10S': { dn: 250, outerDiameter: 273, schStandard: '10S', wallThickness: 4.19, innerDiameter: 264.62 },
    '250-20S': { dn: 250, outerDiameter: 273, schStandard: '20S', wallThickness: 6.5, innerDiameter: 260 },
    '250-40S': { dn: 250, outerDiameter: 273, schStandard: '40S', wallThickness: 9.27, innerDiameter: 254.46 },
    '250-80S': { dn: 250, outerDiameter: 273, schStandard: '80S', wallThickness: 12.7, innerDiameter: 247.6 },
    // DN=300 (12")
    '300-20': { dn: 300, outerDiameter: 323.9, schStandard: '20', wallThickness: 6.35, innerDiameter: 311.2 },
    '300-30': { dn: 300, outerDiameter: 323.9, schStandard: '30', wallThickness: 8.38, innerDiameter: 307.14 },
    '300-40': { dn: 300, outerDiameter: 323.9, schStandard: '40', wallThickness: 10.31, innerDiameter: 303.28 },
    '300-60': { dn: 300, outerDiameter: 323.9, schStandard: '60', wallThickness: 14.27, innerDiameter: 295.36 },
    '300-80': { dn: 300, outerDiameter: 323.9, schStandard: '80', wallThickness: 17.48, innerDiameter: 288.94 },
    '300-100': { dn: 300, outerDiameter: 323.9, schStandard: '100', wallThickness: 21.44, innerDiameter: 281.02 },
    '300-120': { dn: 300, outerDiameter: 323.9, schStandard: '120', wallThickness: 25.4, innerDiameter: 273.1 },
    '300-140': { dn: 300, outerDiameter: 323.9, schStandard: '140', wallThickness: 28.58, innerDiameter: 266.74 },
    '300-160': { dn: 300, outerDiameter: 323.9, schStandard: '160', wallThickness: 33.32, innerDiameter: 257.26 },
    '300-STD': { dn: 300, outerDiameter: 323.9, schStandard: 'STD', wallThickness: 9.53, innerDiameter: 304.84 },
    '300-XS': { dn: 300, outerDiameter: 323.9, schStandard: 'XS', wallThickness: 12.7, innerDiameter: 298.5 },
    '300-XXS': { dn: 300, outerDiameter: 323.9, schStandard: 'XXS', wallThickness: 25.4, innerDiameter: 273.1 },
    '300-5S': { dn: 300, outerDiameter: 323.9, schStandard: '5S', wallThickness: 3.96, innerDiameter: 315.98 },
    '300-10S': { dn: 300, outerDiameter: 323.9, schStandard: '10S', wallThickness: 4.57, innerDiameter: 314.76 },
    '300-20S': { dn: 300, outerDiameter: 323.9, schStandard: '20S', wallThickness: 6.5, innerDiameter: 310.9 },
    '300-40S': { dn: 300, outerDiameter: 323.9, schStandard: '40S', wallThickness: 9.53, innerDiameter: 304.84 },
    '300-80S': { dn: 300, outerDiameter: 323.9, schStandard: '80S', wallThickness: 12.7, innerDiameter: 298.5 },
};
/**
 * 公制管道规格数据
 * 使用公制外径 + ASME B36.10M SCH壁厚标准
 * 内径 = 外径 - 2 × 壁厚
 */
export const PIPE_SPECS_METRIC = {
    // DN=10 (公制外径 14mm)
    '10-40': { dn: 10, outerDiameter: 14, schStandard: '40', wallThickness: 2.31, innerDiameter: 9.38 },
    '10-80': { dn: 10, outerDiameter: 14, schStandard: '80', wallThickness: 3.32, innerDiameter: 7.36 },
    '10-STD': { dn: 10, outerDiameter: 14, schStandard: 'STD', wallThickness: 2.31, innerDiameter: 9.38 },
    '10-XS': { dn: 10, outerDiameter: 14, schStandard: 'XS', wallThickness: 3.32, innerDiameter: 7.36 },
    '10-10S': { dn: 10, outerDiameter: 14, schStandard: '10S', wallThickness: 1.65, innerDiameter: 10.7 },
    '10-20S': { dn: 10, outerDiameter: 14, schStandard: '20S', wallThickness: 2, innerDiameter: 10 },
    '10-40S': { dn: 10, outerDiameter: 14, schStandard: '40S', wallThickness: 2.31, innerDiameter: 9.38 },
    '10-80S': { dn: 10, outerDiameter: 14, schStandard: '80S', wallThickness: 3.2, innerDiameter: 7.6 },
    // DN=15 (公制外径 18mm)
    '15-40': { dn: 15, outerDiameter: 18, schStandard: '40', wallThickness: 2.77, innerDiameter: 12.46 },
    '15-80': { dn: 15, outerDiameter: 18, schStandard: '80', wallThickness: 3.73, innerDiameter: 10.54 },
    '15-160': { dn: 15, outerDiameter: 18, schStandard: '160', wallThickness: 4.78, innerDiameter: 8.44 },
    '15-STD': { dn: 15, outerDiameter: 18, schStandard: 'STD', wallThickness: 2.77, innerDiameter: 12.46 },
    '15-XS': { dn: 15, outerDiameter: 18, schStandard: 'XS', wallThickness: 3.73, innerDiameter: 10.54 },
    '15-XXS': { dn: 15, outerDiameter: 18, schStandard: 'XXS', wallThickness: 7.47, innerDiameter: 3.06 },
    '15-5S': { dn: 15, outerDiameter: 18, schStandard: '5S', wallThickness: 1.65, innerDiameter: 14.7 },
    '15-10S': { dn: 15, outerDiameter: 18, schStandard: '10S', wallThickness: 2.11, innerDiameter: 13.78 },
    '15-20S': { dn: 15, outerDiameter: 18, schStandard: '20S', wallThickness: 2.5, innerDiameter: 13 },
    '15-40S': { dn: 15, outerDiameter: 18, schStandard: '40S', wallThickness: 2.77, innerDiameter: 12.46 },
    '15-80S': { dn: 15, outerDiameter: 18, schStandard: '80S', wallThickness: 3.73, innerDiameter: 10.54 },
    // DN=20 (公制外径 25mm)
    '20-40': { dn: 20, outerDiameter: 25, schStandard: '40', wallThickness: 2.87, innerDiameter: 19.26 },
    '20-80': { dn: 20, outerDiameter: 25, schStandard: '80', wallThickness: 3.91, innerDiameter: 17.18 },
    '20-160': { dn: 20, outerDiameter: 25, schStandard: '160', wallThickness: 5.56, innerDiameter: 13.88 },
    '20-STD': { dn: 20, outerDiameter: 25, schStandard: 'STD', wallThickness: 2.87, innerDiameter: 19.26 },
    '20-XS': { dn: 20, outerDiameter: 25, schStandard: 'XS', wallThickness: 3.91, innerDiameter: 17.18 },
    '20-XXS': { dn: 20, outerDiameter: 25, schStandard: 'XXS', wallThickness: 7.82, innerDiameter: 9.36 },
    '20-5S': { dn: 20, outerDiameter: 25, schStandard: '5S', wallThickness: 1.65, innerDiameter: 21.7 },
    '20-10S': { dn: 20, outerDiameter: 25, schStandard: '10S', wallThickness: 2.11, innerDiameter: 20.78 },
    '20-20S': { dn: 20, outerDiameter: 25, schStandard: '20S', wallThickness: 2.5, innerDiameter: 20 },
    '20-40S': { dn: 20, outerDiameter: 25, schStandard: '40S', wallThickness: 2.87, innerDiameter: 19.26 },
    '20-80S': { dn: 20, outerDiameter: 25, schStandard: '80S', wallThickness: 3.91, innerDiameter: 17.18 },
    // DN=25 (公制外径 32mm)
    '25-40': { dn: 25, outerDiameter: 32, schStandard: '40', wallThickness: 3.38, innerDiameter: 25.24 },
    '25-80': { dn: 25, outerDiameter: 32, schStandard: '80', wallThickness: 4.55, innerDiameter: 22.9 },
    '25-160': { dn: 25, outerDiameter: 32, schStandard: '160', wallThickness: 6.35, innerDiameter: 19.3 },
    '25-STD': { dn: 25, outerDiameter: 32, schStandard: 'STD', wallThickness: 3.38, innerDiameter: 25.24 },
    '25-XS': { dn: 25, outerDiameter: 32, schStandard: 'XS', wallThickness: 4.55, innerDiameter: 22.9 },
    '25-XXS': { dn: 25, outerDiameter: 32, schStandard: 'XXS', wallThickness: 9.09, innerDiameter: 13.82 },
    '25-5S': { dn: 25, outerDiameter: 32, schStandard: '5S', wallThickness: 1.65, innerDiameter: 28.7 },
    '25-10S': { dn: 25, outerDiameter: 32, schStandard: '10S', wallThickness: 2.77, innerDiameter: 26.46 },
    '25-20S': { dn: 25, outerDiameter: 32, schStandard: '20S', wallThickness: 3, innerDiameter: 26 },
    '25-40S': { dn: 25, outerDiameter: 32, schStandard: '40S', wallThickness: 3.38, innerDiameter: 25.24 },
    '25-80S': { dn: 25, outerDiameter: 32, schStandard: '80S', wallThickness: 4.55, innerDiameter: 22.9 },
    // DN=32 (公制外径 38mm)
    '32-40': { dn: 32, outerDiameter: 38, schStandard: '40', wallThickness: 3.56, innerDiameter: 30.88 },
    '32-80': { dn: 32, outerDiameter: 38, schStandard: '80', wallThickness: 4.85, innerDiameter: 28.3 },
    '32-160': { dn: 32, outerDiameter: 38, schStandard: '160', wallThickness: 6.35, innerDiameter: 25.3 },
    '32-STD': { dn: 32, outerDiameter: 38, schStandard: 'STD', wallThickness: 3.56, innerDiameter: 30.88 },
    '32-XS': { dn: 32, outerDiameter: 38, schStandard: 'XS', wallThickness: 4.85, innerDiameter: 28.3 },
    '32-XXS': { dn: 32, outerDiameter: 38, schStandard: 'XXS', wallThickness: 9.7, innerDiameter: 18.6 },
    '32-5S': { dn: 32, outerDiameter: 38, schStandard: '5S', wallThickness: 1.65, innerDiameter: 34.7 },
    '32-10S': { dn: 32, outerDiameter: 38, schStandard: '10S', wallThickness: 2.77, innerDiameter: 32.46 },
    '32-20S': { dn: 32, outerDiameter: 38, schStandard: '20S', wallThickness: 3, innerDiameter: 32 },
    '32-40S': { dn: 32, outerDiameter: 38, schStandard: '40S', wallThickness: 3.56, innerDiameter: 30.88 },
    '32-80S': { dn: 32, outerDiameter: 38, schStandard: '80S', wallThickness: 4.85, innerDiameter: 28.3 },
    // DN=40 (公制外径 45mm)
    '40-40': { dn: 40, outerDiameter: 45, schStandard: '40', wallThickness: 3.68, innerDiameter: 37.64 },
    '40-80': { dn: 40, outerDiameter: 45, schStandard: '80', wallThickness: 5.08, innerDiameter: 34.84 },
    '40-160': { dn: 40, outerDiameter: 45, schStandard: '160', wallThickness: 7.14, innerDiameter: 30.72 },
    '40-STD': { dn: 40, outerDiameter: 45, schStandard: 'STD', wallThickness: 3.68, innerDiameter: 37.64 },
    '40-XS': { dn: 40, outerDiameter: 45, schStandard: 'XS', wallThickness: 5.08, innerDiameter: 34.84 },
    '40-XXS': { dn: 40, outerDiameter: 45, schStandard: 'XXS', wallThickness: 10.15, innerDiameter: 24.7 },
    '40-5S': { dn: 40, outerDiameter: 45, schStandard: '5S', wallThickness: 1.65, innerDiameter: 41.7 },
    '40-10S': { dn: 40, outerDiameter: 45, schStandard: '10S', wallThickness: 2.77, innerDiameter: 39.46 },
    '40-20S': { dn: 40, outerDiameter: 45, schStandard: '20S', wallThickness: 3, innerDiameter: 39 },
    '40-40S': { dn: 40, outerDiameter: 45, schStandard: '40S', wallThickness: 3.68, innerDiameter: 37.64 },
    '40-80S': { dn: 40, outerDiameter: 45, schStandard: '80S', wallThickness: 5.08, innerDiameter: 34.84 },
    // DN=50 (公制外径 57mm)
    '50-40': { dn: 50, outerDiameter: 57, schStandard: '40', wallThickness: 3.91, innerDiameter: 49.18 },
    '50-80': { dn: 50, outerDiameter: 57, schStandard: '80', wallThickness: 5.54, innerDiameter: 45.92 },
    '50-160': { dn: 50, outerDiameter: 57, schStandard: '160', wallThickness: 8.74, innerDiameter: 39.52 },
    '50-STD': { dn: 50, outerDiameter: 57, schStandard: 'STD', wallThickness: 3.91, innerDiameter: 49.18 },
    '50-XS': { dn: 50, outerDiameter: 57, schStandard: 'XS', wallThickness: 5.54, innerDiameter: 45.92 },
    '50-XXS': { dn: 50, outerDiameter: 57, schStandard: 'XXS', wallThickness: 11.07, innerDiameter: 34.86 },
    '50-5S': { dn: 50, outerDiameter: 57, schStandard: '5S', wallThickness: 1.65, innerDiameter: 53.7 },
    '50-10S': { dn: 50, outerDiameter: 57, schStandard: '10S', wallThickness: 2.77, innerDiameter: 51.46 },
    '50-20S': { dn: 50, outerDiameter: 57, schStandard: '20S', wallThickness: 3.5, innerDiameter: 50 },
    '50-40S': { dn: 50, outerDiameter: 57, schStandard: '40S', wallThickness: 3.91, innerDiameter: 49.18 },
    '50-80S': { dn: 50, outerDiameter: 57, schStandard: '80S', wallThickness: 5.54, innerDiameter: 45.92 },
    // DN=65 (公制外径 76mm)
    '65-40': { dn: 65, outerDiameter: 76, schStandard: '40', wallThickness: 5.16, innerDiameter: 65.68 },
    '65-80': { dn: 65, outerDiameter: 76, schStandard: '80', wallThickness: 7.01, innerDiameter: 61.98 },
    '65-160': { dn: 65, outerDiameter: 76, schStandard: '160', wallThickness: 9.53, innerDiameter: 56.94 },
    '65-STD': { dn: 65, outerDiameter: 76, schStandard: 'STD', wallThickness: 5.16, innerDiameter: 65.68 },
    '65-XS': { dn: 65, outerDiameter: 76, schStandard: 'XS', wallThickness: 7.01, innerDiameter: 61.98 },
    '65-XXS': { dn: 65, outerDiameter: 76, schStandard: 'XXS', wallThickness: 14.02, innerDiameter: 47.96 },
    '65-5S': { dn: 65, outerDiameter: 76, schStandard: '5S', wallThickness: 2.11, innerDiameter: 71.78 },
    '65-10S': { dn: 65, outerDiameter: 76, schStandard: '10S', wallThickness: 3.05, innerDiameter: 69.9 },
    '65-20S': { dn: 65, outerDiameter: 76, schStandard: '20S', wallThickness: 3.5, innerDiameter: 69 },
    '65-40S': { dn: 65, outerDiameter: 76, schStandard: '40S', wallThickness: 5.16, innerDiameter: 65.68 },
    '65-80S': { dn: 65, outerDiameter: 76, schStandard: '80S', wallThickness: 7.01, innerDiameter: 61.98 },
    // DN=80 (公制外径 89mm)
    '80-40': { dn: 80, outerDiameter: 89, schStandard: '40', wallThickness: 5.49, innerDiameter: 78.02 },
    '80-80': { dn: 80, outerDiameter: 89, schStandard: '80', wallThickness: 7.62, innerDiameter: 73.76 },
    '80-160': { dn: 80, outerDiameter: 89, schStandard: '160', wallThickness: 11.13, innerDiameter: 66.74 },
    '80-STD': { dn: 80, outerDiameter: 89, schStandard: 'STD', wallThickness: 5.49, innerDiameter: 78.02 },
    '80-XS': { dn: 80, outerDiameter: 89, schStandard: 'XS', wallThickness: 7.62, innerDiameter: 73.76 },
    '80-XXS': { dn: 80, outerDiameter: 89, schStandard: 'XXS', wallThickness: 15.24, innerDiameter: 58.52 },
    '80-5S': { dn: 80, outerDiameter: 89, schStandard: '5S', wallThickness: 2.11, innerDiameter: 84.78 },
    '80-10S': { dn: 80, outerDiameter: 89, schStandard: '10S', wallThickness: 3.05, innerDiameter: 82.9 },
    '80-20S': { dn: 80, outerDiameter: 89, schStandard: '20S', wallThickness: 4, innerDiameter: 81 },
    '80-40S': { dn: 80, outerDiameter: 89, schStandard: '40S', wallThickness: 5.49, innerDiameter: 78.02 },
    '80-80S': { dn: 80, outerDiameter: 89, schStandard: '80S', wallThickness: 7.62, innerDiameter: 73.76 },
    // DN=100 (公制外径 108mm)
    '100-40': { dn: 100, outerDiameter: 108, schStandard: '40', wallThickness: 6.02, innerDiameter: 95.96 },
    '100-80': { dn: 100, outerDiameter: 108, schStandard: '80', wallThickness: 8.56, innerDiameter: 90.88 },
    '100-100': { dn: 100, outerDiameter: 108, schStandard: '100', wallThickness: 11.13, innerDiameter: 85.74 },
    '100-160': { dn: 100, outerDiameter: 108, schStandard: '160', wallThickness: 13.49, innerDiameter: 81.02 },
    '100-STD': { dn: 100, outerDiameter: 108, schStandard: 'STD', wallThickness: 6.02, innerDiameter: 95.96 },
    '100-XS': { dn: 100, outerDiameter: 108, schStandard: 'XS', wallThickness: 8.56, innerDiameter: 90.88 },
    '100-XXS': { dn: 100, outerDiameter: 108, schStandard: 'XXS', wallThickness: 17.12, innerDiameter: 73.76 },
    '100-5S': { dn: 100, outerDiameter: 108, schStandard: '5S', wallThickness: 2.11, innerDiameter: 103.78 },
    '100-10S': { dn: 100, outerDiameter: 108, schStandard: '10S', wallThickness: 3.05, innerDiameter: 101.9 },
    '100-20S': { dn: 100, outerDiameter: 108, schStandard: '20S', wallThickness: 4, innerDiameter: 100 },
    '100-40S': { dn: 100, outerDiameter: 108, schStandard: '40S', wallThickness: 6.02, innerDiameter: 95.96 },
    '100-80S': { dn: 100, outerDiameter: 108, schStandard: '80S', wallThickness: 8.56, innerDiameter: 90.88 },
    // DN=125 (公制外径 133mm)
    '125-40': { dn: 125, outerDiameter: 133, schStandard: '40', wallThickness: 6.55, innerDiameter: 119.9 },
    '125-80': { dn: 125, outerDiameter: 133, schStandard: '80', wallThickness: 9.53, innerDiameter: 113.94 },
    '125-120': { dn: 125, outerDiameter: 133, schStandard: '120', wallThickness: 12.7, innerDiameter: 107.6 },
    '125-160': { dn: 125, outerDiameter: 133, schStandard: '160', wallThickness: 15.88, innerDiameter: 101.24 },
    '125-STD': { dn: 125, outerDiameter: 133, schStandard: 'STD', wallThickness: 6.55, innerDiameter: 119.9 },
    '125-XS': { dn: 125, outerDiameter: 133, schStandard: 'XS', wallThickness: 9.53, innerDiameter: 113.94 },
    '125-XXS': { dn: 125, outerDiameter: 133, schStandard: 'XXS', wallThickness: 19.05, innerDiameter: 94.9 },
    '125-5S': { dn: 125, outerDiameter: 133, schStandard: '5S', wallThickness: 2.77, innerDiameter: 127.46 },
    '125-10S': { dn: 125, outerDiameter: 133, schStandard: '10S', wallThickness: 3.4, innerDiameter: 126.2 },
    '125-20S': { dn: 125, outerDiameter: 133, schStandard: '20S', wallThickness: 5, innerDiameter: 123 },
    '125-40S': { dn: 125, outerDiameter: 133, schStandard: '40S', wallThickness: 6.55, innerDiameter: 119.9 },
    '125-80S': { dn: 125, outerDiameter: 133, schStandard: '80S', wallThickness: 9.53, innerDiameter: 113.94 },
    // DN=150 (公制外径 159mm)
    '150-40': { dn: 150, outerDiameter: 159, schStandard: '40', wallThickness: 7.11, innerDiameter: 144.78 },
    '150-80': { dn: 150, outerDiameter: 159, schStandard: '80', wallThickness: 10.97, innerDiameter: 137.06 },
    '150-120': { dn: 150, outerDiameter: 159, schStandard: '120', wallThickness: 14.27, innerDiameter: 130.46 },
    '150-160': { dn: 150, outerDiameter: 159, schStandard: '160', wallThickness: 18.26, innerDiameter: 122.48 },
    '150-STD': { dn: 150, outerDiameter: 159, schStandard: 'STD', wallThickness: 7.11, innerDiameter: 144.78 },
    '150-XS': { dn: 150, outerDiameter: 159, schStandard: 'XS', wallThickness: 10.97, innerDiameter: 137.06 },
    '150-XXS': { dn: 150, outerDiameter: 159, schStandard: 'XXS', wallThickness: 21.95, innerDiameter: 115.1 },
    '150-5S': { dn: 150, outerDiameter: 159, schStandard: '5S', wallThickness: 2.77, innerDiameter: 153.46 },
    '150-10S': { dn: 150, outerDiameter: 159, schStandard: '10S', wallThickness: 3.4, innerDiameter: 152.2 },
    '150-20S': { dn: 150, outerDiameter: 159, schStandard: '20S', wallThickness: 5, innerDiameter: 149 },
    '150-40S': { dn: 150, outerDiameter: 159, schStandard: '40S', wallThickness: 7.11, innerDiameter: 144.78 },
    '150-80S': { dn: 150, outerDiameter: 159, schStandard: '80S', wallThickness: 10.97, innerDiameter: 137.06 },
    // DN=200 (公制外径 219mm)
    '200-20': { dn: 200, outerDiameter: 219, schStandard: '20', wallThickness: 6.35, innerDiameter: 206.3 },
    '200-30': { dn: 200, outerDiameter: 219, schStandard: '30', wallThickness: 7.04, innerDiameter: 204.92 },
    '200-40': { dn: 200, outerDiameter: 219, schStandard: '40', wallThickness: 8.18, innerDiameter: 202.64 },
    '200-60': { dn: 200, outerDiameter: 219, schStandard: '60', wallThickness: 10.31, innerDiameter: 198.38 },
    '200-80': { dn: 200, outerDiameter: 219, schStandard: '80', wallThickness: 12.7, innerDiameter: 193.6 },
    '200-100': { dn: 200, outerDiameter: 219, schStandard: '100', wallThickness: 15.09, innerDiameter: 188.82 },
    '200-120': { dn: 200, outerDiameter: 219, schStandard: '120', wallThickness: 18.26, innerDiameter: 182.48 },
    '200-140': { dn: 200, outerDiameter: 219, schStandard: '140', wallThickness: 20.62, innerDiameter: 177.76 },
    '200-160': { dn: 200, outerDiameter: 219, schStandard: '160', wallThickness: 23.01, innerDiameter: 172.98 },
    '200-STD': { dn: 200, outerDiameter: 219, schStandard: 'STD', wallThickness: 8.18, innerDiameter: 202.64 },
    '200-XS': { dn: 200, outerDiameter: 219, schStandard: 'XS', wallThickness: 12.7, innerDiameter: 193.6 },
    '200-XXS': { dn: 200, outerDiameter: 219, schStandard: 'XXS', wallThickness: 22.23, innerDiameter: 174.54 },
    '200-5S': { dn: 200, outerDiameter: 219, schStandard: '5S', wallThickness: 2.77, innerDiameter: 213.46 },
    '200-10S': { dn: 200, outerDiameter: 219, schStandard: '10S', wallThickness: 3.76, innerDiameter: 211.48 },
    '200-20S': { dn: 200, outerDiameter: 219, schStandard: '20S', wallThickness: 6.5, innerDiameter: 206 },
    '200-40S': { dn: 200, outerDiameter: 219, schStandard: '40S', wallThickness: 8.18, innerDiameter: 202.64 },
    '200-80S': { dn: 200, outerDiameter: 219, schStandard: '80S', wallThickness: 12.7, innerDiameter: 193.6 },
    // DN=250 (公制外径 273mm)
    '250-20': { dn: 250, outerDiameter: 273, schStandard: '20', wallThickness: 6.35, innerDiameter: 260.3 },
    '250-30': { dn: 250, outerDiameter: 273, schStandard: '30', wallThickness: 7.8, innerDiameter: 257.4 },
    '250-40': { dn: 250, outerDiameter: 273, schStandard: '40', wallThickness: 9.27, innerDiameter: 254.46 },
    '250-60': { dn: 250, outerDiameter: 273, schStandard: '60', wallThickness: 12.7, innerDiameter: 247.6 },
    '250-80': { dn: 250, outerDiameter: 273, schStandard: '80', wallThickness: 15.09, innerDiameter: 242.82 },
    '250-100': { dn: 250, outerDiameter: 273, schStandard: '100', wallThickness: 18.26, innerDiameter: 236.48 },
    '250-120': { dn: 250, outerDiameter: 273, schStandard: '120', wallThickness: 21.44, innerDiameter: 230.12 },
    '250-140': { dn: 250, outerDiameter: 273, schStandard: '140', wallThickness: 25.4, innerDiameter: 222.2 },
    '250-160': { dn: 250, outerDiameter: 273, schStandard: '160', wallThickness: 28.58, innerDiameter: 215.84 },
    '250-STD': { dn: 250, outerDiameter: 273, schStandard: 'STD', wallThickness: 9.27, innerDiameter: 254.46 },
    '250-XS': { dn: 250, outerDiameter: 273, schStandard: 'XS', wallThickness: 12.7, innerDiameter: 247.6 },
    '250-XXS': { dn: 250, outerDiameter: 273, schStandard: 'XXS', wallThickness: 25.4, innerDiameter: 222.2 },
    '250-5S': { dn: 250, outerDiameter: 273, schStandard: '5S', wallThickness: 3.4, innerDiameter: 266.2 },
    '250-10S': { dn: 250, outerDiameter: 273, schStandard: '10S', wallThickness: 4.19, innerDiameter: 264.62 },
    '250-20S': { dn: 250, outerDiameter: 273, schStandard: '20S', wallThickness: 6.5, innerDiameter: 260 },
    '250-40S': { dn: 250, outerDiameter: 273, schStandard: '40S', wallThickness: 9.27, innerDiameter: 254.46 },
    '250-80S': { dn: 250, outerDiameter: 273, schStandard: '80S', wallThickness: 12.7, innerDiameter: 247.6 },
    // DN=300 (公制外径 325mm)
    '300-20': { dn: 300, outerDiameter: 325, schStandard: '20', wallThickness: 6.35, innerDiameter: 312.3 },
    '300-30': { dn: 300, outerDiameter: 325, schStandard: '30', wallThickness: 8.38, innerDiameter: 308.24 },
    '300-40': { dn: 300, outerDiameter: 325, schStandard: '40', wallThickness: 10.31, innerDiameter: 304.38 },
    '300-60': { dn: 300, outerDiameter: 325, schStandard: '60', wallThickness: 14.27, innerDiameter: 296.46 },
    '300-80': { dn: 300, outerDiameter: 325, schStandard: '80', wallThickness: 17.48, innerDiameter: 290.04 },
    '300-100': { dn: 300, outerDiameter: 325, schStandard: '100', wallThickness: 21.44, innerDiameter: 282.12 },
    '300-120': { dn: 300, outerDiameter: 325, schStandard: '120', wallThickness: 25.4, innerDiameter: 274.2 },
    '300-140': { dn: 300, outerDiameter: 325, schStandard: '140', wallThickness: 28.58, innerDiameter: 267.84 },
    '300-160': { dn: 300, outerDiameter: 325, schStandard: '160', wallThickness: 33.32, innerDiameter: 258.36 },
    '300-STD': { dn: 300, outerDiameter: 325, schStandard: 'STD', wallThickness: 9.53, innerDiameter: 305.94 },
    '300-XS': { dn: 300, outerDiameter: 325, schStandard: 'XS', wallThickness: 12.7, innerDiameter: 299.6 },
    '300-XXS': { dn: 300, outerDiameter: 325, schStandard: 'XXS', wallThickness: 25.4, innerDiameter: 274.2 },
    '300-5S': { dn: 300, outerDiameter: 325, schStandard: '5S', wallThickness: 3.96, innerDiameter: 317.08 },
    '300-10S': { dn: 300, outerDiameter: 325, schStandard: '10S', wallThickness: 4.57, innerDiameter: 315.86 },
    '300-20S': { dn: 300, outerDiameter: 325, schStandard: '20S', wallThickness: 6.5, innerDiameter: 312 },
    '300-40S': { dn: 300, outerDiameter: 325, schStandard: '40S', wallThickness: 9.53, innerDiameter: 305.94 },
    '300-80S': { dn: 300, outerDiameter: 325, schStandard: '80S', wallThickness: 12.7, innerDiameter: 299.6 },
};
/**
 * 根据DN和SCH标准获取管道规格
 * @param dn 管道公称直径
 * @param schStandard SCH标准 (默认: '40')
 * @param pipeStandard 管道标准 (默认: 'metric' 公制)
 * @returns 管道规格，如果未找到返回 null
 */
export function getPipeSpec(dn, schStandard = '40', pipeStandard = 'metric') {
    const key = `${dn}-${schStandard}`;
    const data = pipeStandard === 'metric' ? PIPE_SPECS_METRIC : PIPE_SPECS_DATA;
    // 如果公制表中没有，回退到英制表
    if (pipeStandard === 'metric' && !data[key]) {
        return PIPE_SPECS_DATA[key] || null;
    }
    return data[key] || null;
}
/**
 * 获取指定DN的所有可用SCH标准
 * @param dn 管道公称直径
 * @param pipeStandard 管道标准 (默认: 'metric' 公制)
 * @returns SCH标准列表
 */
export function getAvailableSchStandards(dn, pipeStandard = 'metric') {
    const standards = [];
    const data = pipeStandard === 'metric' ? PIPE_SPECS_METRIC : PIPE_SPECS_DATA;
    for (const key in data) {
        const spec = data[key];
        if (spec.dn === dn) {
            standards.push(spec.schStandard);
        }
    }
    // 如果公制表中没有该DN，回退到英制表
    if (pipeStandard === 'metric' && standards.length === 0) {
        for (const key in PIPE_SPECS_DATA) {
            const spec = PIPE_SPECS_DATA[key];
            if (spec.dn === dn) {
                standards.push(spec.schStandard);
            }
        }
    }
    return standards.sort((a, b) => {
        // 标准排序: STD, XS, XXS, 数字
        const order = { 'STD': 1, 'XS': 2, 'XXS': 3 };
        if (order[a] && order[b])
            return order[a] - order[b];
        if (order[a])
            return -1;
        if (order[b])
            return 1;
        // 提取数字进行排序
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum))
            return aNum - bNum;
        return a.localeCompare(b);
    });
}
/**
 * 获取所有支持的DN列表
 * @param pipeStandard 管道标准 (默认: 'metric' 公制)
 * @returns DN列表
 */
export function getAllSupportedDN(pipeStandard = 'metric') {
    const dnSet = new Set();
    const data = pipeStandard === 'metric' ? PIPE_SPECS_METRIC : PIPE_SPECS_DATA;
    for (const key in data) {
        dnSet.add(data[key].dn);
    }
    // 公制表如果没有某些DN，也合并英制表的DN
    if (pipeStandard === 'metric') {
        for (const key in PIPE_SPECS_DATA) {
            dnSet.add(PIPE_SPECS_DATA[key].dn);
        }
    }
    return Array.from(dnSet).sort((a, b) => a - b);
}
