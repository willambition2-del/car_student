import 'package:flutter/material.dart';

abstract class AppShadows {
  // Ultra-subtle elevation shadow for cards (border-first approach)
  static const List<BoxShadow> subtle = [
    BoxShadow(
      color: Color(0x0A0F172A),
      blurRadius: 6,
      offset: Offset(0, 2),
    ),
  ];

  static const List<BoxShadow> soft = [
    BoxShadow(
      color: Color(0x0E0F172A),
      blurRadius: 10,
      offset: Offset(0, 4),
    ),
  ];

  static const List<BoxShadow> none = [];
}
