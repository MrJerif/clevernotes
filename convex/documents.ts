import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get request (Notes 'sidebar')
export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
        folderId: v.optional(v.id("folders")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        }
        const userId = identity.subject;
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocument", args.parentDocument)
            )
            .filter((q) =>
                q.eq(q.field("isArchived"), false)
            )  // Deleted notes not visible
            .order("desc")
            .collect();

        return documents;
    },
});

// Get request (folders)
export const getFolders = query({
    args: {
        folderId: v.optional(v.id("folders"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        }
        const userId = identity.subject;
        const folders = await ctx.db
            .query("folders")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), false)
            )   // Archived folders not visible
            .order("desc")
            .collect();

        return folders;
    },
});

// Get request (Trash)
export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), true),
            )  // Only Deleted notes are visible
            .order("desc")
            .collect();

        return documents;
    },
});

// Get request (Folders in trash)
export const folderTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        }
        const userId = identity.subject;
        const documents = await ctx.db
            .query("folders")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), true),
            )  // Only Deleted Folders are visible
            .order("desc")
            .collect();

        return documents;
    },
});

// Get request (Total Tokens)
export const getTokens = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        }
        const userId = identity.subject;
        const tokens = await ctx.db
            .query("tokens")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("userId"), userId)
            )
            .collect();

        if (!tokens) {
            throw new Error("Token record not found");
        }
        return tokens;
    },
});

// Get request (Search Notes)
export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject;
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), false),
            )  // Deleted notes not visible
            .order("desc")
            .collect();

        return documents;
    }
});

// Get request (Note)
export const getById = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const document = await ctx.db.get(args.documentId);

        if (!document) {
            throw new Error("Not Found");
        }

        if (document.isArchived && !document.isArchived) {
            return document;
        }

        if (!identity) {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject;
        if (document.userId !== userId) {
            throw new Error('Unauthorized');
        }
        return document;
    }
});

// Get request (Folder)
export const folderById = query({
    args: { folderId: v.id("folders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const document = await ctx.db.get(args.folderId);

        if (!document) {
            throw new Error("Not Found");
        }

        if (document.isArchived && !document.isArchived) {
            return document;
        }

        if (!identity) {
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject;
        if (document.userId !== userId) {
            throw new Error('Unauthorized');
        }
        return document;
    }
});

// Get request (Published notes)
export const getPublishedDoc = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.documentId);

        if (!document) {
            throw new Error("Not Found");
        }

        if (document.isArchived) {
            return;
        }

        if (document.isPublished) {
            return document;
        } else {
            throw new Error("Not Found");
        }
    }
});

// Get request (Published folder)
export const getPublishedFolder = query({
    args: { folderId: v.id("folders") },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.folderId);

        if (!document) {
            throw new Error("Not Found");
        }

        if (document.isArchived) {
            return;
        }

        if (document.isPublished) {
            return document;
        } else {
            throw new Error("Not Found");
        }
    }
});

// Get request (Published Notes by folderId)
export const getPublishedDocsByFolder = query({
    args: { folderId: v.id("folders") },
    handler: async (ctx, args) => {
        const documents = await ctx.db.query("documents")
            .withIndex("by_folder_Id",
                (q) =>
                    q.eq(("folderId"), args.folderId)
            )
            .collect();

        // filter published docs
        const publishedDocs = documents.filter((doc) => doc.isPublished && !doc.isArchived);

        if (publishedDocs.length === 0) {
            return;
        }

        return publishedDocs;
    }
});

// Post request (Notes 'sidebar')
export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
        folderId: v.optional(v.id("folders")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
            folderId: args.folderId,
        });
        return document;
    }
});

// Post request (Create Tokens)
export const createToken = mutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };
        // const userId = identity.subject;
        const existingTokens = await ctx.db
            .query("tokens")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();

        if (!existingTokens) {
            await ctx.db.insert("tokens", {
                userId: args.userId,
                tokenCount: 199
            });
        }
        // return token;
    }
});

// Post request (Add Folders)
export const addFolder = mutation({
    args: {
        title: v.string(),
        icon: v.optional(v.string()),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;

        const folder = await ctx.db.insert("folders", {
            // folderId: args.folderId,
            title: args.title,
            userId,
            icon: args.icon,
            description: args.description,
            isArchived: false,
            isPublished: false,
        });
        return folder;
    }
});

// Edit request (Update Notes)
export const update = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;
        // Omit ID (Id remain same)
        const { id, ...rest } = args;

        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Note not found');
        }

        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // Update Note
        const document = await ctx.db.patch(args.id, {
            ...rest,
        });
        return document;
    }
});

// Edit request (Update folder) 
export const updateFolder = mutation({
    args: {
        id: v.id("folders"),
        isPublished: v.optional(v.boolean()),
        documentId: v.optional(v.id("documents")),
        title: v.optional(v.string()),
        icon: v.optional(v.string()),
        isArchived: v.optional(v.boolean()),
        description: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };
        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);

        const { id, ...rest } = args;
        // If Folder dosen't exist
        if (!existingDocument) {
            throw new Error('Folder not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const document = await ctx.db.patch(args.id, {
            ...rest,
        });
        return document;
    }
});

// Edit request (calculate tokens used)
export const tokensUsed = mutation({
    args: {
        // tokenId: v.optional(v.id("tokens")),
        // userId: v.optional(v.string()),
        tokenCount: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;
        const userTokens = await ctx.db
            .query("tokens")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        // check tokens 
        if (!userTokens?.tokenCount) {
            throw new Error("User tokens not found");
        }

        if (userTokens?.tokenCount < args.tokenCount) {
            throw new Error("Insufficient tokens");
        }

        const usedTokens = userTokens?.tokenCount - args.tokenCount;

        const token = await ctx.db.patch(userTokens._id, {
            tokenCount: usedTokens
        });
        return token;
    }
});

// Edit request (Add tokens)
export const buyTokens = mutation({
    args: {
        tokenCount: v.number(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        // If request is from frontend
        if (identity) {
            const userId = identity.subject;

            const price = {
                basic: 0.50,
                basic2: 0.80,
                medium: 1.39,
                medium2: 2.30,
                large: 3.46,
                premium: 4.33,
            };
            const priceToTokens = {
                [price.basic]: 349,
                [price.basic2]: 1047,
                [price.medium]: 1745,
                [price.medium2]: 2792,
                [price.large]: 4188,
                [price.premium]: 5235,
            }
            const dollarPrice = args.tokenCount;

            const tokensToAdd = priceToTokens[dollarPrice]
            if (!tokensToAdd) {
                throw new Error(`Invalid dollar price: ${dollarPrice}.`);
            }

            // const userId = identity.subject;
            const userTokens = await ctx.db
                .query("tokens")
                .withIndex("by_user", (q) => q.eq("userId", userId))
                .first();

            // check tokens 
            if (!userTokens?.tokenCount) {
                throw new Error("User tokens not found");
            }

            const purchasedTokens = userTokens?.tokenCount + tokensToAdd;
            // console.log('Token Cound userTOKENS 🟢: ', userTokens.tokenCount);
            // console.log('Token to Add🔴: ', tokensToAdd);
            // console.log('purchasedTokens 🟢🔴🟠: ', purchasedTokens);
            return await ctx.db.patch(userTokens._id, {
                tokenCount: purchasedTokens
            });
        }
    }
});

// Edit request (Move notes to different folder)
export const moveNotes = mutation({
    args: {
        id: v.id("documents"),
        folderId: v.optional(v.id("folders")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Note not found');
        }

        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // Update Note
        const document = await ctx.db.patch(args.id, {
            folderId: args.folderId,
        });
        return document;
    }
})

// Edit request (send note to Trash)
export const archive = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };
        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Note not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }
        // Recursion (all children notes)
        const recusriveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for (let child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recusriveArchive(child._id);
            }
        }
        const document = await ctx.db.patch(args.id, {
            isArchived: true, // Archive
        });
        recusriveArchive(args.id);
        return document;
    }
});

// Edit request (restore Note from Trash)
export const restore = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };
        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Note not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }
        // Recursion (all children notes)
        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();
            for (let child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false, // Unarchive
                });
                await recursiveRestore(child._id);
            }
        };
        const option: Partial<Doc<"documents">> = {
            isArchived: false,
        };
        // Check for parent notes 
        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);
            if (parent?.isArchived) {
                option.parentDocument = undefined;
            }
        }
        const document = await ctx.db.patch(args.id, option);
        recursiveRestore(args.id);
        return document;
    }
});

// Edit request (restore Folders from Trash)
export const restoreFolder = mutation({
    args: { id: v.id("folders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };
        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Note not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }
        const folder = await ctx.db.patch(args.id, {
            isArchived: false,
        });
        return folder;
    }
});

// Edit request (send folders to Trash)
export const archiveFolder = mutation({
    args: {
        id: v.id("folders"),
        documentId: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };
        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If Folder dosen't exist
        if (!existingDocument) {
            throw new Error('Folder not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // Delete all Notes present in the folder 
        const recusriveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for (let child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });
                await recusriveArchive(child._id);
            }
        };
        const document = await ctx.db.patch(args.id, {
            isArchived: true, // Archive
        });
        if (args.documentId) {
            recusriveArchive(args.documentId);
        }
        return document;
    }
});

// Delete request (Notes)
export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Note not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const document = await ctx.db.delete(args.id);
        return document;
    }
});

// Delete request (Folders)
export const removeFolders = mutation({
    args: {
        id: v.id("folders"),
        // documentId: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Folder not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const document = await ctx.db.delete(args.id);
        return document;
    }
})

// Delete request (Icon)
export const removeIcon = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }
        const document = await ctx.db.patch(args.id, {
            icon: undefined
        });
        return document;
    }
});

// Delete request (Cover Image)
export const removeCoverImage = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // If not authenticated
        if (!identity) {
            throw new Error("Not Authenticated");
        };

        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id);
        // If document dosen't exist
        if (!existingDocument) {
            throw new Error('Not found');
        }
        // Authorization
        if (existingDocument.userId !== userId) {
            throw new Error('Unauthorized');
        }
        const document = await ctx.db.patch(args.id, {
            coverImage: undefined,
        });
        return document;
    }
});