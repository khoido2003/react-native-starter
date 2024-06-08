import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.caynhalavuon.aora",
  projectId: "6620e76f4fb7bc42896c",
  databaseId: "6620e8d081006c0c3b56",
  usersCollectionId: "6620e8e641941aca113f",
  videosCollectionId: "6620e90f6e918ec442d8",
  storageId: "6620eb5bb994ef0eb1c2",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatar = new Avatars(client);
const database = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    const avatarUrl = avatar.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (err) {
    throw new Error(err);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (err) {
    throw new Error(err);
  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error("No current account!");

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("User does not existed!");

    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};
