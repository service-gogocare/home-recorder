import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase'; // Ensure this path is correct
import type { Caregiver } from '../types/caregiver';

const COLLECTION_NAME = 'caregivers';

export const caregiverService = {
    // Get all caregivers
    getAll: async (): Promise<Caregiver[]> => {
        try {
            const q = query(collection(db, COLLECTION_NAME));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Caregiver));
        } catch (error) {
            console.error('Error getting caregivers:', error);
            throw error;
        }
    },

    // Add a new caregiver
    add: async (caregiver: Omit<Caregiver, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...caregiver,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding caregiver:', error);
            throw error;
        }
    },

    // Update a caregiver
    update: async (id: string, data: Partial<Caregiver>): Promise<void> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating caregiver:', error);
            throw error;
        }
    },

    // Delete a caregiver
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting caregiver:', error);
            throw error;
        }
    },

    // Get caregivers by status
    getByStatus: async (status: string): Promise<Caregiver[]> => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('status', '==', status),
                orderBy('name')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Caregiver));
        } catch (error) {
            console.error('Error getting active caregivers:', error);
            throw error;
        }
    }
};
