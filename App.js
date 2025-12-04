import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Приветственное сообщение
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '🍽️ **ФудГид**\n\nПривет! Я твой помощник по питанию.\n\n• Даю рецепты с калориями\n• Составляю меню на день\n• Помогаю достичь целей\n\nЧто хочешь приготовить?',
        createdAt: new Date(),
        user: { _id: 2, name: 'ФудГид' },
      },
    ]);
  }, []);

  // Логика ответов
  const generateFoodGuideResponse = (text) => {
    const query = text.toLowerCase().trim();

    // Профиль
    if (query.includes('профиль')) {
      if (!userProfile) return '👤 Профиль пуст. Напишите: "Мой рост 165 см, вес 62 кг"';
      return `👤 Ваш профиль:\nРост: ${userProfile.height} см\nВес: ${userProfile.weight} кг\nЦель: ${userProfile.goal}`;
    }

    // Фавориты
    if (query.includes('фавориты')) {
      if (favorites.length === 0) return '⭐ Фаворитов пока нет. Напишите: "Сохрани омлет"';
      return `⭐ Ваши фавориты:\n${favorites.map(f => `• ${f.name}`).join('\n')}`;
    }

    // Сохранение
    if (query.startsWith('сохрани')) {
      const dish = text.replace('сохрани', '').trim();
      setFavorites(prev => [...prev, { name: dish }]);
      return `✅ Сохранено: "${dish}"`;
    }

    // Рецепты
    if (query.includes('омлет')) {
      return '🍳 **Омлет**\n⏱ 10 мин | 📊 280 ккал\n\nИнгредиенты: 2 яйца, молоко, соль\nПриготовление: взбить и обжарить';
    }

    if (query.includes('паста') || query.includes('карбонара')) {
      return '🍝 **Паста Карбонара**\n⏱ 20 мин | 📊 420 ккал\n\nИнгредиенты: спагетти, бекон, яйца, сыр\nПриготовление: смешать всё вместе';
    }

    if (query.includes('салат')) {
      return '🥗 **Греческий салат**\n⏱ 15 мин | 📊 250 ккал\n\nИнгредиенты: помидоры, огурец, сыр фета, оливки\nПриготовление: нарезать и смешать';
    }

    if (query.includes('меню')) {
      return '📅 **Меню на день**\n\nЗавтрак: Овсянка (320 ккал)\nОбед: Суп (280 ккал)\nУжин: Рыба с овощами (350 ккал)\n\nИтого: 950 ккал';
    }

    // Обновление профиля
    if (query.includes('рост') && query.includes('вес')) {
      const height = query.match(/рост\s*(\d+)/)?.[1] || '?';
      const weight = query.match(/вес\s*(\d+)/)?.[1] || '?';
      setUserProfile({ height, weight, goal: 'здоровое питание' });
      return `✅ Профиль обновлён!\nРост: ${height} см, Вес: ${weight} кг`;
    }

    return `🤔 По запросу "${text}" рекомендую:\n• Омлет (280 ккал)\n• Салат (250 ккал)\n• Пасту (420 ккал)\n\nУточните, что именно нужно?`;
  };

  const onSend = useCallback((newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
    
    const botResponse = generateFoodGuideResponse(newMessages[0].text);
    
    setTimeout(() => {
      setMessages(prev => GiftedChat.append(prev, [{
        _id: Math.random() * 10000,
        text: botResponse,
        createdAt: new Date(),
        user: { _id: 2, name: 'ФудГид' },
      }]));
    }, 800);
  }, [userProfile, favorites]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        placeholder="Напиши блюдо или 'профиль'..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
