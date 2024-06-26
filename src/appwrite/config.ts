import { CreateUserAccount, LoginUserAccount } from "@/types/types";
import { Client, Account, ID, Databases, Query } from "appwrite";
import config from "@/config/conf";
import { toast } from "@/components/ui/use-toast";

export const appwriteClient = new Client();

const {
  appwriteUrl: ENDPOINT,
  appwriteProjectId: PROJECT_ID,
  appwriteDatabaseId: DATABASE_ID,
  appwriteClientsCollectionId: CLIENTS_COLLECTION_ID,
  appwriteUsageCollectionId: USAGE_COLLECTION_ID,
} = config;

appwriteClient.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(appwriteClient);
const databases = new Databases(appwriteClient);

export class AppwriteService {
  async createUserAccount({ email, password, name, id }: CreateUserAccount) {
    try {
      const userAccount = await account.create(
        id ? id : ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error: any) {
      throw error;
    }
  }

  async login({ email, password }: LoginUserAccount) {
    try {
      return await account.createEmailSession(email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error) { }

    return false;
  }

  async getCurrentUser() {
    try {
      return account.get();
    } catch (error) {
      console.log("getcurrentUser error: " + error);
    }
    return null;
  }

  async logout() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      console.log("logout error: " + error);
    }
  }

  async getClients() {
    try {
      const clients = await databases.listDocuments(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      return clients;
    } catch (error) {
      throw error;
    }
  }
  async getUsage() {
    try {
      const clients = await databases.listDocuments(
        DATABASE_ID,
        USAGE_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      return clients;
    } catch (error) {
      throw error;
    }
  }
  async getClient(DOCUMENT_ID: string) {
    try {
      const client = await databases.getDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        DOCUMENT_ID
      );
      return client;
    } catch (error) {
      throw error;
    }
  }
  async getClientUsage(DOCUMENT_ID: string) {
    try {
      const clientUsage = await databases.getDocument(
        DATABASE_ID,
        USAGE_COLLECTION_ID,
        DOCUMENT_ID
      );
      return clientUsage;
    } catch (error) {
      throw error;
    }
  }
  async createClient(data: any) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        data.email,
        data.phone,
        data.name
      );
      if (userAccount) {
        const client = await databases.createDocument(
          DATABASE_ID,
          CLIENTS_COLLECTION_ID,
          userAccount.$id,
          { name: data.name, phone: data.phone, meter: data.meter }
        );
        return client;
      } else {
        return userAccount;
      }

    } catch (error) {
      throw error;
    }
  }
  async createUsage(data: any) {
    try {
      const client = await databases.createDocument(
        DATABASE_ID,
        USAGE_COLLECTION_ID,
        ID.unique(),
        data
      );
      return client;
    } catch (error) {
      throw error;
    }
  }

  async updateClient(DOCUMENT_ID: string, data: any) {
    try {
      const updatedClient = await databases.updateDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        DOCUMENT_ID,
        data
      );
      return updatedClient;
    } catch (error) {
      throw error;
    }
  }
  async updateUsage(DOCUMENT_ID: string, data: any) {
    try {
      const updatedClient = await databases.updateDocument(
        DATABASE_ID,
        USAGE_COLLECTION_ID,
        DOCUMENT_ID,
        data
      );
      return updatedClient;
    } catch (error) {
      throw error;
    }
  }

  async deleteClient(DOCUMENT_ID: string) {
    try {
      const deleted = await databases.deleteDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        DOCUMENT_ID
      );
      return deleted;
    } catch (error) {
      throw error;
    }
  }
  async deleteUsage(DOCUMENT_ID: string) {
    try {
      const deleted = await databases.deleteDocument(
        DATABASE_ID,
        USAGE_COLLECTION_ID,
        DOCUMENT_ID
      );
      if (deleted) {
        toast({
          title: "Record Has Been Deleted Successfuly.",
        })
      }
    } catch (error) {
      throw error;
    }
  }
}

export const appwriteService = new AppwriteService();
