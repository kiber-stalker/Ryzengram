import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../constants/supabase';

export default function ChatScreen({ route }) {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at');
      if (data) setMessages(data);
    };
    load();
    const sub = supabase.channel(`chat:${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, payload => setMessages(prev => [...prev, payload.new]))
      .subscribe();
    return () => sub.unsubscribe();
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('messages').insert({ chat_id: chatId, sender_id: user.id, content: text });
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList data={messages} renderItem={({ item }) => (<View style={styles.message}><Text>{item.content}</Text></View>)} keyExtractor={item => item.id} />
      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={text} onChangeText={setText} />
        <TouchableOpacity onPress={send}><Text>Отправить</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { padding: 10, margin: 5, backgroundColor: '#e5e5ea', borderRadius: 10 },
  inputBar: { flexDirection: 'row', padding: 10 },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, padding: 10 }
});