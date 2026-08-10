import 'package:flutter/material.dart';

abstract class AppSpacing {
  static const double xxs = 2.0;
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;

  // EdgeInsets helpers
  static const EdgeInsets pagePadding = EdgeInsets.symmetric(
    horizontal: lg,
    vertical: md,
  );
  static const EdgeInsets cardPadding = EdgeInsets.all(lg);
  static const EdgeInsets inputPadding = EdgeInsets.symmetric(
    horizontal: lg,
    vertical: md,
  );

  // SizedBox vertical helpers
  static const SizedBox vBox4 = SizedBox(height: xs);
  static const SizedBox vBox8 = SizedBox(height: sm);
  static const SizedBox vBox12 = SizedBox(height: md);
  static const SizedBox vBox16 = SizedBox(height: lg);
  static const SizedBox vBox20 = SizedBox(height: xl);
  static const SizedBox vBox24 = SizedBox(height: xxl);
  static const SizedBox vBox32 = SizedBox(height: xxxl);

  // SizedBox horizontal helpers
  static const SizedBox hBox4 = SizedBox(width: xs);
  static const SizedBox hBox8 = SizedBox(width: sm);
  static const SizedBox hBox12 = SizedBox(width: md);
  static const SizedBox hBox16 = SizedBox(width: lg);
  static const SizedBox hBox20 = SizedBox(width: xl);
  static const SizedBox hBox24 = SizedBox(width: xxl);
}
