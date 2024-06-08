import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import EmptyState from "../../components/empty-state";

import { searchPosts } from "../../lib/appwrite";
import { useAppwrite } from "../../hooks/useAppwrite";
import VideoCard from "../../components/video-card";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Search = () => {
  const { query } = useLocalSearchParams();

  const {
    data: posts,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetchPosts();
  }, [query]);

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
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100 ">
              Search Results
            </Text>
            <Text className="text-2xl font-semibold text-white">{query}</Text>

            <View className="mt-6 mb-8 ">
              {/* Search input */}

              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query!"
          />
        )}
      />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
