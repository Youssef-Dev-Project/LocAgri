// Bubbles.js
import React from 'react';
import { StyleSheet, View, } from 'react-native';

const Bubbles = () => (
  <>
    <View style={[styles.bubble, styles.topBubble]}></View>
    <View style={[styles.bubble, styles.bottomBubble]}></View>
    <View style={[styles.bubble, styles.rightBubble]}></View>
    <View style={[styles.bubble, styles.leftBubble]}></View>
    <View style={[styles.bubble, styles.extraBubble1]}></View>
    <View style={[styles.bubble, styles.extraBubble2]}></View>
    <View style={[styles.bubble, styles.extraBubble3]}></View>
    <View style={[styles.bubble, styles.extraBubble4]}></View>
    <View style={[styles.bubble, styles.extraBubble5]}></View>
  </>
);

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: '#388e3c', // Dark green bubble
    borderRadius: 50, // Circle shape
  },
  topBubble: {
    top: -60,
    left: 10,
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  bottomBubble: {
    bottom: -60,
    right: 10,
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  rightBubble: {
    top: '50%',
    right: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  leftBubble: {
    top: '50%',
    left: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  extraBubble1: {
    top: 100,
    left: 60,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  extraBubble2: {
    bottom: 100,
    right: 60,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  extraBubble3: {
    top: 200,
    right: 10,
    width: 70,
    height: 70,
    opacity: 0.3,
  },
  extraBubble4: {
    bottom: 200,
    left: 10,
    width: 70,
    height: 70,
    opacity: 0.3,
  },
  extraBubble5: {
    top: 300,
    left: 80,
    width: 90,
    height: 90,
    opacity: 0.2,
  },
});

export default Bubbles;
