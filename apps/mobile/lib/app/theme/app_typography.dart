import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

abstract class AppTypography {
  static TextStyle get fontBase {
    try {
      return GoogleFonts.cairo();
    } catch (_) {
      return const TextStyle(fontFamily: 'Cairo');
    }
  }

  // Display & Headlines (Controlled size, clean weight)
  static TextStyle get displayLarge => fontBase.copyWith(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        color: AppColors.mainText,
        height: 1.3,
      );

  static TextStyle get headlineLarge => fontBase.copyWith(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: AppColors.mainText,
        height: 1.35,
      );

  static TextStyle get headlineMedium => fontBase.copyWith(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.mainText,
        height: 1.35,
      );

  // Titles
  static TextStyle get titleLarge => fontBase.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: AppColors.mainText,
        height: 1.4,
      );

  static TextStyle get titleMedium => fontBase.copyWith(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.mainText,
        height: 1.4,
      );

  static TextStyle get titleSmall => fontBase.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.mainText,
        height: 1.4,
      );

  // Body
  static TextStyle get bodyLarge => fontBase.copyWith(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        color: AppColors.mainText,
        height: 1.5,
      );

  static TextStyle get bodyMedium => fontBase.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: AppColors.mainText,
        height: 1.5,
      );

  static TextStyle get bodySmall => fontBase.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: AppColors.secondaryText,
        height: 1.4,
      );

  // Buttons & Labels
  static TextStyle get buttonLarge => fontBase.copyWith(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: Colors.white,
        height: 1.2,
      );

  static TextStyle get buttonMedium => fontBase.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: Colors.white,
        height: 1.2,
      );

  static TextStyle get labelMedium => fontBase.copyWith(
        fontSize: 13,
        fontWeight: FontWeight.w500,
        color: AppColors.secondaryText,
      );

  static TextStyle get caption => fontBase.copyWith(
        fontSize: 11,
        fontWeight: FontWeight.w400,
        color: AppColors.mutedText,
        height: 1.3,
      );
}
