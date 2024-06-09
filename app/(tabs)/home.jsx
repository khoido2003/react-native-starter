import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import EmptyState from "../../components/empty-state";

import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { useAppwrite } from "../../hooks/useAppwrite";
import VideoCard from "../../components/video-card";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/global-provider";

const Home = () => {
  const {
    data: posts,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useAppwrite(getAllPosts);
  const {
    data: latestPosts,
    isLoading: isLoadingLatestPosts,
    refetch: refetchLatestPosts,
  } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const onRefresh = async () => {
    setRefreshing(true);

    await refetchLatestPosts();
    await refetchPosts();

    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          return (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.creator.username}
              avatar={item.creator.avatar}
            />
          );
        }}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100 ">
                  Welcome back,
                </Text>
                <Text className="text-2xl font-semibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            {/* Latest video section */}
            <View className="w-full flex-1 pt-5 pb-8 font-pregular mb-3">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="be the first one to upload the video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
