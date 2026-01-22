import { Request, Response } from 'express';
import admin from '../config/firebase';

const db = admin.firestore();

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(200).json({
                uid: userId,
                email: (req as any).user.email,
                displayName: "",
                college: "",
                bio: "",
                photoURL: "",
                major: "",
                year: "",
                interests: []
            });
        }

        const userData = userDoc.data();

        res.status(200).json({
            uid: userId,
            email: (req as any).user.email,
            ...userData
        });

    } catch (error: any) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        const { displayName, college, bio, photoURL, major, year, interests } = req.body;

        const updateData: any = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (college !== undefined) updateData.college = college;
        if (bio !== undefined) updateData.bio = bio;
        if (photoURL !== undefined) updateData.photoURL = photoURL;
        if (major !== undefined) updateData.major = major;
        if (year !== undefined) updateData.year = year;
        if (interests !== undefined) updateData.interests = interests;

        // Use set with merge: true to create if not exists or update
        await db.collection('users').doc(userId).set(updateData, { merge: true });

        res.status(200).json({ message: "Profile updated successfully" });

    } catch (error: any) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const getPublicProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userDoc = await db.collection('users').doc(id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.data();

        // Return only public information
        const publicProfile = {
            uid: id,
            displayName: userData?.displayName || "Anonymous Student",
            college: userData?.college || "",
            bio: userData?.bio || "",
            photoURL: userData?.photoURL || "",
            major: userData?.major || "",
            year: userData?.year || "",
            interests: userData?.interests || []
        };

        res.status(200).json(publicProfile);

    } catch (error: any) {
        console.error("Get Public Profile Error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};
