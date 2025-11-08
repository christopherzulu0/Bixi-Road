import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { auth } from "@clerk/nextjs/server"

const f = createUploadthing()

export const ourFileRouter = {

    articleImageUploader: f({
        pdf: { maxFileSize: "8MB", maxFileCount: 1 },
        image: { maxFileSize: "8MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "8MB" },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "8MB",
        },
    })
        .middleware(async ({ req }) => {
            const { userId } = await auth()
            if (!userId) throw new UploadThingError("Unauthorized")
            return { userId }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("CV uploaded for userId:", metadata.userId)
            console.log("CV url:", file.ufsUrl)
            return { url: file.ufsUrl }
        }),

    sellerDocumentUploader: f({
        pdf: { maxFileSize: "8MB", maxFileCount: 1 },
        image: { maxFileSize: "8MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "8MB" },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "8MB",
        },
    })
        .middleware(async ({ req }) => {
            const { userId } = await auth()
            if (!userId) throw new UploadThingError("Unauthorized")
            return { userId }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("CV uploaded for userId:", metadata.userId)
            console.log("CV url:", file.ufsUrl)
            return { url: file.ufsUrl }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

