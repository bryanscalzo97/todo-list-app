import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface BottomMenuProps {
  options: { label: string; onPress: () => void }[];
}

const BottomMenu: React.FC<BottomMenuProps> = ({ options }) => {
  const [isVisible, setIsVisible] = useState(false);

  const openMenu = () => setIsVisible(true);
  const closeMenu = () => setIsVisible(false);

  return (
    <>
      <TouchableOpacity onPress={openMenu}>
        <Ionicons name="ellipsis-vertical" size={22} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.overlay} onPress={closeMenu} />

        <View style={styles.modalContent}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuOption}
              onPress={() => {
                option.onPress();
                closeMenu();
              }}
            >
              <Text style={styles.menuOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.menuOption}
            onPress={() => {
              closeMenu();
            }}
          >
            <Text style={styles.menuOptionText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5,
  },
  menuOption: {
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BottomMenu;
