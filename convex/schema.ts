import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema ({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),

        folderId: v.optional(v.id("folders")),

        // like: v.optional(v.number()),
        // comment: v.optional(v.array(v.string())),
        // share: v.optional(v.number()),
        // isSaved: v.optional(v.boolean()),
    })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
    .index("by_folder_Id", ["folderId"]),

    folders: defineTable({
        title: v.string(),
        userId: v.string(),
        icon: v.optional(v.string()),
        isArchived: v.boolean(),
        isPublished: v.boolean(),
        description: v.optional(v.string()),
    })
    .index("by_user", ["userId"]),

    tokens: defineTable({
        userId: v.string(),
        tokenCount: v.optional(v.number()),
    })
    .index("by_user", ["userId"]),

    // users: defineTable({
    //     userId: v.string(),
    //     firstName: v.optional(v.string()),
    //     lastName: v.optional(v.string()),
    //     email: v.optional(v.string()),
    //     avatar: v.optional(v.string()),
    //     color: v.optional(v.string()),
    // })
});