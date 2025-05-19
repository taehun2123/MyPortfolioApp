import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TechStackItemProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
}

/**
 * 기술 스택 아이템 컴포넌트
 */
const TechStackItem: React.FC<TechStackItemProps> = ({ title, items, icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
        {items.length === 0 && (
          <Text style={styles.emptyText}>등록된 항목이 없습니다.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 8,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemText: {
    fontSize: 12,
    color: '#4b5563',
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    padding: 4,
  },
});

export default TechStackItem;