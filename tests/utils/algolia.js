const {
  isRelationPublished,
  sanitizeData,
  sanitizeActivityGroup,
} = require("../../utils/algolia");

describe("Algolia utils", () => {
  describe("isRelationPublished", () => {
    it("catches null relations", async () => {
      const value = await isRelationPublished(null);
      expect(value).toEqual(false);
    });
    it("catches undefined relations", async () => {
      const value = await isRelationPublished(undefined);
      expect(value).toEqual(false);
    });
    it("catches relations with no id", async () => {
      const value = await isRelationPublished({});
      expect(value).toEqual(false);
    });
    it("catches relations with no published_at", async () => {
      const value = await isRelationPublished({ id: 1 });
      expect(value).toEqual(false);
    });
    it("passes relations with published_at and id", async () => {
      const value = await isRelationPublished({
        id: 1,
        publishedAt: "2020-01-01",
      });
      expect(value).toEqual(true);
    });
  });

  describe("sanitizeData", () => {
    it("removes created_by and updated_by recursively", () => {
      const input = {
        id: 1,
        created_by: "test",
        updated_by: "test",
        relation1: [
          {
            id: 2,
            created_by: "test",
            updated_by: "test",
            relation: {
              id: 3,
              created_by: "test",
              updated_by: "test",
            },
          },
          {
            id: 2,
            created_by: "test",
            updated_by: "test",
          },
        ],
        relation2: {
          id: 2,
          created_by: "test",
          updated_by: "test",
          relation: {
            id: 3,
            created_by: "test",
            updated_by: "test",
          },
        },
      };

      const targetOutput = {
        id: 1,
        relation1: [
          {
            id: 2,
            relation: {
              id: 3,
            },
          },
          {
            id: 2,
          },
        ],
        relation2: {
          id: 2,
          relation: {
            id: 3,
          },
        },
      };
      const result = sanitizeData("asd", input);

      expect(result).toEqual(targetOutput);
    });
  });

  describe("cleanActivityGroup", () => {
    it("removes all but `id` and `title` from acitvities", () => {
      const input = {
        id: 1,
        title: "asd",
        activities: [
          {
            id: 2,
            title: "asd",
            ingress: "ingress asdasd",
            dummy: 123,
          },
          {
            id: 3,
            title: "bsd",
            ingress: "ingress asdasd",
            fake: true,
          },
          {
            id: 4,
            ingress: "ingress asdasd",
          },
        ],
      };

      const targetOutput = {
        id: 1,
        title: "asd",
        activities: [
          {
            id: 2,
            title: "asd",
          },
          {
            id: 3,
            title: "bsd",
          },
          {
            id: 4,
          },
        ],
      };

      expect(sanitizeActivityGroup(input)).toEqual(targetOutput);
    });
  });
});
