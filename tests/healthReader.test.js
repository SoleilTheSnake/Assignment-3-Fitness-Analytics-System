const { healthMetricsCounter } = require("../healthReader");
const fs = require("fs").promises;
const path = require("path");

describe("healthMetricsCounter", () => {
    const testDir = path.join(__dirname, "testData");
    const validJsonFile = path.join(testDir, "valid-metrics.json");
    const emptyJsonFile = path.join(testDir, "empty.json");
    const invalidJsonFile = path.join(testDir, "invalid.json");
    const missingFile = path.join(testDir, "missing.json");

    beforeAll(async () => {
        await fs.mkdir(testDir, { recursive: true });
        await fs.writeFile(validJsonFile, JSON.stringify({ metrics: [{ id: 1 }, { id: 2 }, { id: 3 }] }));
        await fs.writeFile(emptyJsonFile, "");
        await fs.writeFile(invalidJsonFile, "{ invalid json }");
    });

    afterAll(async () => {
        await fs.rm(testDir, { recursive: true, force: true });
    });

    test("should read valid JSON file and return correct entry count", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();
        const result = await healthMetricsCounter(validJsonFile);
        expect(result).toBe(3);
        expect(consoleSpy).toHaveBeenCalledWith("Total health entries: 3");
        consoleSpy.mockRestore();
    });

    test("should return undefined and log error for missing file", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const result = await healthMetricsCounter(missingFile);
        expect(result).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error: File not found.");
        consoleErrorSpy.mockRestore();
    });

    test("should return undefined and log error for empty file", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const result = await healthMetricsCounter(emptyJsonFile);
        expect(result).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", "File is empty.");
        consoleErrorSpy.mockRestore();
    });

    test("should return undefined and log error for invalid JSON format", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const result = await healthMetricsCounter(invalidJsonFile);
        expect(result).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Invalid JSON format.");
        consoleErrorSpy.mockRestore();
    });

    test("should return correct data structure (number)", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();
        const result = await healthMetricsCounter(validJsonFile);
        expect(typeof result).toBe("number");
        expect(result).toBeGreaterThan(0);
        consoleSpy.mockRestore();
    });
});