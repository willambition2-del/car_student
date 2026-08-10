import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';

class AppTextField extends StatelessWidget {
  final String? label;
  final String hintText;
  final String? helperText;
  final TextEditingController? controller;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final int maxLines;
  final bool obscureText;
  final bool readOnly;
  final VoidCallback? onTap;
  final ValueChanged<String>? onChanged;
  final bool isRequired;

  const AppTextField({
    super.key,
    this.label,
    required this.hintText,
    this.helperText,
    this.controller,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.prefixIcon,
    this.suffixIcon,
    this.maxLines = 1,
    this.obscureText = false,
    this.readOnly = false,
    this.onTap,
    this.onChanged,
    this.isRequired = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Row(
            children: [
              Text(
                label!,
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.mainText,
                  fontWeight: FontWeight.w600,
                ),
              ),
              if (isRequired) ...[
                const SizedBox(width: 4),
                Text(
                  '*',
                  style: AppTypography.titleMedium.copyWith(
                    color: AppColors.errorRed,
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 6),
        ],
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          validator: validator,
          maxLines: maxLines,
          obscureText: obscureText,
          readOnly: readOnly,
          onTap: onTap,
          onChanged: onChanged,
          style: AppTypography.bodyMedium,
          decoration: InputDecoration(
            hintText: hintText,
            helperText: helperText,
            helperStyle: AppTypography.caption,
            prefixIcon: prefixIcon != null
                ? Icon(prefixIcon, color: AppColors.secondaryText, size: 20)
                : null,
            suffixIcon: suffixIcon,
          ),
        ),
      ],
    );
  }
}

class PasswordField extends StatefulWidget {
  final String? label;
  final String hintText;
  final TextEditingController? controller;
  final String? Function(String?)? validator;

  const PasswordField({
    super.key,
    this.label,
    this.hintText = 'أدخل كلمة المرور',
    this.controller,
    this.validator,
  });

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      label: widget.label,
      hintText: widget.hintText,
      controller: widget.controller,
      validator: widget.validator,
      obscureText: _obscureText,
      keyboardType: TextInputType.visiblePassword,
      prefixIcon: Icons.lock_outline_rounded,
      suffixIcon: IconButton(
        icon: Icon(
          _obscureText
              ? Icons.visibility_outlined
              : Icons.visibility_off_outlined,
          color: AppColors.secondaryText,
          size: 20,
        ),
        onPressed: () => setState(() => _obscureText = !_obscureText),
      ),
    );
  }
}

class SearchField extends StatelessWidget {
  final String hintText;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClear;
  final TextEditingController? controller;

  const SearchField({
    super.key,
    this.hintText = 'بحث...',
    this.onChanged,
    this.onClear,
    this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      hintText: hintText,
      controller: controller,
      onChanged: onChanged,
      prefixIcon: Icons.search_rounded,
      suffixIcon: controller?.text.isNotEmpty == true || onClear != null
          ? IconButton(
              icon: const Icon(
                Icons.clear_rounded,
                color: AppColors.secondaryText,
                size: 20,
              ),
              onPressed: onClear,
            )
          : null,
    );
  }
}
