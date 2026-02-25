const { usersworkoutCalculator } = require('../workoutReader');
const fs = require('fs');
const path = require('path');

describe('usersworkoutCalculator', () => {
    const testDataDir = path.join(__dirname, 'testData');

    beforeAll(() => {
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir, { recursive: true });
        }
    });

    afterAll(() => {
        if (fs.existsSync(testDataDir)) {
            fs.rmSync(testDataDir, { recursive: true });
        }
    });

    test('should read valid CSV file and return correct totals', async () => {
        const csvPath = path.join(testDataDir, 'valid.csv');
        fs.writeFileSync(csvPath, 'duration\n30\n45\n60\n');

        const result = await usersworkoutCalculator(csvPath);

        expect(result).toEqual({ totalWorkouts: 3, totalDuration: 135 });
        expect(result.totalWorkouts).toBe(3);
        expect(result.totalDuration).toBe(135);
    });

    test('should return 0 for empty CSV file', async () => {
        const csvPath = path.join(testDataDir, 'empty.csv');
        fs.writeFileSync(csvPath, 'duration\n');

        const result = await usersworkoutCalculator(csvPath);

        expect(result.totalWorkouts).toBe(0);
        expect(result.totalDuration).toBe(0);
    });

    test('should reject when CSV file is missing', async () => {
        await expect(usersworkoutCalculator('./nonexistent/file.csv')).rejects.toThrow();
    });

    test('should have correct data structure', async () => {
        const csvPath = path.join(testDataDir, 'structure.csv');
        fs.writeFileSync(csvPath, 'duration\n25\n');

        const result = await usersworkoutCalculator(csvPath);

        expect(result).toHaveProperty('totalWorkouts');
        expect(result).toHaveProperty('totalDuration');
        expect(typeof result.totalWorkouts).toBe('number');
        expect(typeof result.totalDuration).toBe('number');
    });
});