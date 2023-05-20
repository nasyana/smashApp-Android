import React from 'react';

/* styles */
import {styles} from '../styles';
import {DEFAULT_DATA} from '../data';
import {TouchableOpacity, Modal, Image} from 'react-native';
import {View, Text, Checkbox} from 'react-native-ui-lib';

type ModalTypes = {
  setShowModal: (value: boolean) => void;
  showTheModal: boolean;
};

const Separator = () => <View style={styles.separator} />;

const SubscriptionModal = (props: ModalTypes) => {
  const {showTheModal, setShowModal} = props;

  const closeModal = () => setShowModal(!showTheModal);
  return (
    <Modal visible={showTheModal} transparent={true} animationType="fade">
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <View style={styles.closableContainer}>
            <TouchableOpacity onPress={closeModal} activeOpacity={0.5}>
              <Text style={{fontSize: 22, color: '#7a7a7a'}}>x</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>PERSONAL</Text>
            <View style={{marginTop: 30}}>
              <Image
                style={styles.imageStyles}
                source={require('../../../../assets/images/subscribe.png')}
              />
            </View>
            <Text style={styles.subHeaderText}>$1 / month</Text>
          </View>

          <Separator />

          <View>
            {DEFAULT_DATA.map((x) => (
              <View style={styles.checkboxContainer} key={x.key}>
                <Checkbox
                  color="#c4c6cd"
                  value={x.checked}
                  label={x.label}
                  labelStyle={styles.checkboxStyles}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeModal}
            style={styles.touchableStyles}>
            <View style={styles.btnContainer}>
              <Text style={styles.btnTextStyles}>SUBSCRIBE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SubscriptionModal;
