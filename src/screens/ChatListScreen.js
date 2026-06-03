import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supabase } from '../constants/supabase';

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('chat_participants').select('chat_id, chats(*)').eq('user_id', user.id);
        if (data) setChats(data);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ryzengram</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
      <FlatList data={chats} renderItem={({ item }) => (
        <TouchableOpacity style={styles.chatItem}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.chatAvatar} />
          <Text style={styles.chatName}>Чат</Text>
        </TouchableOpacity>
      )} keyExtractor={item => item.chat_id} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  title: { fontSize: 24 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  chatItem: { flexDirection: 'row', padding: 15 },
  chatAvatar: { width: 50, height: 50, borderRadius: 25 },
  chatName: { fontSize: 16 }
});