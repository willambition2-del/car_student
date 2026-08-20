import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/map_widgets.dart';

class MapLocationPickerScreen extends StatefulWidget {
  const MapLocationPickerScreen({super.key});

  @override
  State<MapLocationPickerScreen> createState() =>
      _MapLocationPickerScreenState();
}

class _MapLocationPickerScreenState extends State<MapLocationPickerScreen> {
  final _regionController = TextEditingController(text: 'حي النور');
  final _landmarkController = TextEditingController(text: 'بجوار مسجد الهدى');
  final _descriptionController = TextEditingController(text: 'شارع الخليج - فيلا 45');
  LatLng _pickedLocation = const LatLng(24.8210, 46.6690);
  bool _isSaving = false;

  @override
  void dispose() {
    _regionController.dispose();
    _landmarkController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _useCurrentLocation() {
    setState(() {
      _regionController.text = 'حي النزهة (موقعي الحالي)';
      _landmarkController.text = 'بالقرب من مركز الملك فهد';
      _descriptionController.text = 'مبنى 12 - الشقة 4';
      _pickedLocation = const LatLng(24.8180, 46.6450);
    });
  }

  void _saveLocation() async {
    setState(() => _isSaving = true);
    await Future.delayed(const Duration(milliseconds: 400));
    if (mounted) {
      setState(() => _isSaving = false);
      final address = '${_regionController.text} - ${_descriptionController.text}';
      context.pop(address);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'تحديد موقع المنزل على الخريطة',
      subtitle: 'اختر موقع التقاط ونزول الطالب الحقيقي',
      padding: EdgeInsets.zero,
      body: Stack(
        children: [
          AppGoogleMapView(
            initialCenter: _pickedLocation,
            initialZoom: 15.0,
            onCameraMove: (pos) {
              _pickedLocation = pos.target;
            },
          ),
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: AppColors.primaryNavy,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.location_on_rounded,
                    color: Colors.white,
                    size: 26,
                  ),
                ),
                Container(width: 2, height: 12, color: AppColors.primaryNavy),
              ],
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16.0),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                border: Border(top: BorderSide(color: AppColors.border, width: 1)),
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
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
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'تفاصيل موقع التجميع والمنزل',
                          style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                        ),
                        AppTextButton(
                          text: 'استخدام موقعي الحالي',
                          icon: Icons.my_location_rounded,
                          onPressed: _useCurrentLocation,
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: AppTextField(
                            label: 'المنطقة / الحي',
                            hintText: 'اسم الحي',
                            controller: _regionController,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: AppTextField(
                            label: 'أقرب معلم',
                            hintText: 'مسجد أو مدرسة',
                            controller: _landmarkController,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    AppTextField(
                      label: 'وصف المنزل / الشارع',
                      hintText: 'رقم الشارع والفيلا / المبنى',
                      controller: _descriptionController,
                    ),
                    const SizedBox(height: 14),
                    PrimaryButton(
                      text: 'حفظ الموقع والتأكيد',
                      isLoading: _isSaving,
                      onPressed: _saveLocation,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
