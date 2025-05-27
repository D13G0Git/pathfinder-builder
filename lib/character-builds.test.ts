import { getCharacterBuild, CHARACTER_BUILDS, FOUNDRY_BUILD } from './character-builds'; // Adjust path if necessary

describe('getCharacterBuild', () => {
  describe('Successful Retrieval', () => {
    it('should return the specific build for Fighter, Humano', () => {
      const result = getCharacterBuild("Fighter", "Humano");
      expect(result).not.toBeNull();
      // Type assertion to satisfy TypeScript if result is not null
      const expectedBuild = CHARACTER_BUILDS["Fighter"]["Humano"];
      expect(result).toEqual(expectedBuild);
      
      if (result) { // Check to satisfy TypeScript's strict null checks
        expect(result.success).toBe(true);
        expect(result.build.name).toBe("Valiant Human Fighter");
        expect(result.build.class).toBe("Fighter");
        expect(result.build.ancestry).toBe("Humano");
        expect(result.build.level).toBe(1);
        expect(result.build.abilities.str).toBe(18);
      }
    });

    it('should return the specific build for Wizard, Elfo', () => {
      const result = getCharacterBuild("Wizard", "Elfo");
      expect(result).not.toBeNull();
      const expectedBuild = CHARACTER_BUILDS["Wizard"]["Elfo"];
      expect(result).toEqual(expectedBuild);

      if (result) {
        expect(result.success).toBe(true);
        expect(result.build.name).toBe("Elara Meadowlight");
        expect(result.build.class).toBe("Wizard");
        expect(result.build.ancestry).toBe("Elfo");
        expect(result.build.level).toBe(1);
        expect(result.build.abilities.int).toBe(18);
      }
    });
  });

  describe('Fallback Logic', () => {
    it('should fallback to Humano for Fighter if race is not found', () => {
      // Assuming "Orco" is not defined for Fighter, but "Humano" is.
      const result = getCharacterBuild("Fighter", "Orco");
      expect(result).not.toBeNull();
      const expectedFallbackBuild = CHARACTER_BUILDS["Fighter"]["Humano"];
      expect(result).toEqual(expectedFallbackBuild);

      if (result) {
        expect(result.build.ancestry).toBe("Humano");
        expect(result.build.class).toBe("Fighter");
      }
    });

    it('should fallback to Humano for Rogue if race is not found', () => {
      // Assuming "Mediano" is not defined for Rogue, but "Humano" is.
      const result = getCharacterBuild("Rogue", "Mediano");
      expect(result).not.toBeNull();
      const expectedFallbackBuild = CHARACTER_BUILDS["Rogue"]["Humano"];
      expect(result).toEqual(expectedFallbackBuild);
      
      if (result) {
        expect(result.build.ancestry).toBe("Humano");
        expect(result.build.class).toBe("Rogue");
        expect(result.build.name).toBe("Shadow Quickfoot"); // Check name to ensure it's the Rogue Humano
      }
    });
  });

  describe('Not Found Cases', () => {
    it('should return null if class is found, but specific race and Humano fallback are not found', () => {
      // For this test, we rely on the current CHARACTER_BUILDS structure.
      // Wizard has "Elfo" but does not have "Humano". So, asking for "Wizard" with "Orco" should fail.
      // If Wizard *did* have a Humano fallback, this test would need adjustment or a new class.
      // Let's check the CHARACTER_BUILDS for Wizard:
      // Wizard: { Elfo: { ... } } -> No Humano entry for Wizard.
      const result = getCharacterBuild("Wizard", "Orco");
      expect(result).toBeNull();
    });
    
    it('should return null if class is not found', () => {
      const result = getCharacterBuild("Monk", "Humano");
      expect(result).toBeNull();
    });

    it('should return null if class exists but race does not and no Humano fallback for that class', () => {
      // Example: If we had a class "Druid" with only "Leshy" build.
      // CHARACTER_BUILDS["Druid"] = { "Leshy": { ... some build ... } };
      // Then getCharacterBuild("Druid", "Humano") should be null.
      // Using the current structure, Wizard does not have a "Humano" fallback.
      const result = getCharacterBuild("Wizard", "Humano"); // Wizard has Elfo, but no Humano.
      expect(result).toBeNull();
    });
  });

  describe('Console Warning Checks (Optional - requires spyOn)', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should warn when falling back to Humano', () => {
      getCharacterBuild("Fighter", "Orco");
      expect(consoleWarnSpy).toHaveBeenCalledWith('No build found for Orco in Fighter. Falling back to Humano.');
    });

    it('should warn when class is not found', () => {
      getCharacterBuild("Monk", "Humano");
      expect(consoleWarnSpy).toHaveBeenCalledWith('No builds found for class: Monk');
    });

    it('should warn when race and Humano fallback are not found for an existing class', () => {
      getCharacterBuild("Wizard", "Orco"); // Wizard has Elfo, no Humano, no Orco
      expect(consoleWarnSpy).toHaveBeenCalledWith('No build found for Orco in Wizard, and no Humano fallback available for this class.');
    });
  });
});
