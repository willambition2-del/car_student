import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import 'app_buttons.dart';

class AppDialog extends StatelessWidget {
  final String title;
  final String content;
  final String confirmText;
  final String? cancelText;
  final VoidCallback onConfirm;
  final VoidCallback? onCancel;

  const AppDialog({
    super.key,
    required this.title,
    required this.content,
    this.confirmText = 'تأكيد',
    this.cancelText = 'إلغاء',
    required this.onConfirm,
    this.onCancel,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required String title,
    required String content,
    String confirmText = 'تأكيد',
    String? cancelText = 'إلغاء',
    required VoidCallback onConfirm,
    VoidCallback? onCancel,
  }) {
    return showDialog<T>(
      context: context,
      builder: (ctx) => AppDialog(
        title: title,
        content: content,
        confirmText: confirmText,
        cancelText: cancelText,
        onConfirm: () {
          Navigator.of(ctx).pop();
          onConfirm();
        },
        onCancel: () {
          Navigator.of(ctx).pop();
          if (onCancel != null) onCancel();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.borderLg),
      backgroundColor: AppColors.surface,
      surfaceTintColor: Colors.transparent,
      title: Text(
        title,
        style: AppTypography.titleLarge,
        textAlign: TextAlign.center,
      ),
      content: Text(
        content,
        style: AppTypography.bodyMedium,
        textAlign: TextAlign.center,
      ),
      actionsPadding: const EdgeInsets.all(16),
      actions: [
        Row(
          children: [
            if (cancelText != null) ...[
              Expanded(
                child: OutlineButton(
                  text: cancelText!,
                  onPressed: onCancel ?? () => Navigator.of(context).pop(),
                ),
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: PrimaryButton(text: confirmText, onPressed: onConfirm),
            ),
          ],
        ),
      ],
    );
  }
}

class ConfirmationSheet extends StatelessWidget {
  final String title;
  final String message;
  final String confirmText;
  final VoidCallback onConfirm;

  const ConfirmationSheet({
    super.key,
    required this.title,
    required this.message,
    this.confirmText = 'تأكيد الإجراء',
    required this.onConfirm,
  });

  static Future<void> show(
    BuildContext context, {
    required String title,
    required String message,
    String confirmText = 'تأكيد الإجراء',
    required VoidCallback onConfirm,
  }) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => ConfirmationSheet(
        title: title,
        message: message,
        confirmText: confirmText,
        onConfirm: onConfirm,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          Text(title, style: AppTypography.titleLarge),
          const SizedBox(height: 8),
          Text(
            message,
            style: AppTypography.bodyMedium.copyWith(color: AppColors.secondaryText),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          PrimaryButton(
            text: confirmText,
            onPressed: () {
              Navigator.pop(context);
              onConfirm();
            },
          ),
          const SizedBox(height: 10),
          OutlineButton(
            text: 'تراجع',
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }
}

class FilterBottomSheet extends StatelessWidget {
  final String title;
  final List<String> options;
  final String selectedOption;
  final ValueChanged<String> onSelected;

  const FilterBottomSheet({
    super.key,
    required this.title,
    required this.options,
    required this.selectedOption,
    required this.onSelected,
  });

  static Future<void> show(
    BuildContext context, {
    required String title,
    required List<String> options,
    required String selectedOption,
    required ValueChanged<String> onSelected,
  }) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => FilterBottomSheet(
        title: title,
        options: options,
        selectedOption: selectedOption,
        onSelected: onSelected,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(title, style: AppTypography.titleLarge),
          const SizedBox(height: 12),
          ...options.map((opt) {
            final isSelected = opt == selectedOption;
            return ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 4),
              title: Text(
                opt,
                style: AppTypography.titleMedium.copyWith(
                  color: isSelected ? AppColors.primaryNavy : AppColors.mainText,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
              trailing: isSelected
                  ? const Icon(
                      Icons.check_circle_rounded,
                      color: AppColors.primaryNavy,
                      size: 20,
                    )
                  : null,
              onTap: () {
                onSelected(opt);
                Navigator.pop(context);
              },
            );
          }),
        ],
      ),
    );
  }
}

class AppToast {
  static void show(
    BuildContext context,
    String message, {
    bool isError = false,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: AppTypography.bodyMedium.copyWith(color: Colors.white),
        ),
        backgroundColor: isError ? AppColors.errorRed : AppColors.successGreen,
        behavior: SnackBarBehavior.floating,
        shape: const RoundedRectangleBorder(borderRadius: AppRadius.borderLg),
      ),
    );
  }
}
