import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_shadows.dart';

class AppGoogleMapView extends StatefulWidget {
  final LatLng initialCenter;
  final double initialZoom;
  final Set<Marker> markers;
  final Set<Polyline> polylines;
  final void Function(LatLng)? onTap;
  final void Function(CameraPosition)? onCameraMove;
  final void Function(GoogleMapController)? onMapCreated;
  final bool interactive;
  final String? emptyNotice;

  const AppGoogleMapView({
    super.key,
    this.initialCenter = const LatLng(24.8210, 46.6690),
    this.initialZoom = 13.5,
    this.markers = const <Marker>{},
    this.polylines = const <Polyline>{},
    this.onTap,
    this.onCameraMove,
    this.onMapCreated,
    this.interactive = true,
    this.emptyNotice,
  });

  @override
  State<AppGoogleMapView> createState() => _AppGoogleMapViewState();
}

class _AppGoogleMapViewState extends State<AppGoogleMapView> {
  GoogleMapController? _controller;
  final bool _hasError = false;

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.emptyNotice != null) {
      return Container(
        width: double.infinity,
        height: double.infinity,
        color: const Color(0xFFF8FAFC),
        padding: const EdgeInsets.all(24),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: AppColors.primarySoft,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.location_off_rounded,
                  color: AppColors.primaryNavy,
                  size: 36,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                widget.emptyNotice!,
                style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'يمكن لولي الأمر تحديد موقع المنزل من شاشة الملف الشخصي',
                style: AppTypography.caption.copyWith(color: AppColors.secondaryText),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    if (_hasError) {
      return const MapPlaceholder(
        title: 'خريطة المسارات المعتمدة',
        subtitle: 'تعذر تحميل خريطة Google - جاري استخدام المعاينة التخطيطية',
      );
    }

    return Stack(
      children: [
        GoogleMap(
          initialCameraPosition: CameraPosition(
            target: widget.initialCenter,
            zoom: widget.initialZoom,
          ),
          markers: widget.markers,
          polylines: widget.polylines,
          onTap: widget.onTap,
          onCameraMove: widget.onCameraMove,
          onMapCreated: (ctrl) {
            _controller = ctrl;
            widget.onMapCreated?.call(ctrl);
          },
          zoomControlsEnabled: false,
          myLocationButtonEnabled: false,
          mapToolbarEnabled: false,
          rotateGesturesEnabled: widget.interactive,
          scrollGesturesEnabled: widget.interactive,
          zoomGesturesEnabled: widget.interactive,
          tiltGesturesEnabled: false,
        ),
        Positioned(
          bottom: 16,
          left: 16,
          child: FloatingActionButton.small(
            backgroundColor: AppColors.surface,
            foregroundColor: AppColors.primaryNavy,
            elevation: 2,
            onPressed: () {
              _controller?.animateCamera(
                CameraUpdate.newLatLngZoom(widget.initialCenter, widget.initialZoom),
              );
            },
            child: const Icon(Icons.my_location_rounded, size: 20),
          ),
        ),
      ],
    );
  }
}

class MapPlaceholder extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback? onRecenter;

  const MapPlaceholder({
    super.key,
    this.title = 'خريطة المسار الثابت',
    this.subtitle = 'عرض نقاط التجمع والمسار المعتمد',
    this.onRecenter,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color(0xFFF1F5F9),
      child: Stack(
        children: [
          CustomPaint(size: Size.infinite, painter: _MapGridPainter()),
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
                boxShadow: AppShadows.subtle,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.map_outlined,
                    color: AppColors.primaryNavy,
                    size: 24,
                  ),
                  const SizedBox(width: 10),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                      ),
                      Text(subtitle, style: AppTypography.caption),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 140,
            left: 120,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: AppColors.primaryNavy,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.directions_bus_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
          ),
          Positioned(
            top: 60,
            right: 80,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: AppColors.successGreen,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.school_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
          ),
          if (onRecenter != null)
            Positioned(
              bottom: 20,
              left: 20,
              child: FloatingActionButton.small(
                backgroundColor: AppColors.surface,
                foregroundColor: AppColors.primaryNavy,
                elevation: 1,
                onPressed: onRecenter,
                child: const Icon(Icons.my_location_rounded),
              ),
            ),
        ],
      ),
    );
  }
}

class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFE2E8F0)
      ..strokeWidth = 1;

    for (double i = 0; i < size.width; i += 40) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double i = 0; i < size.height; i += 40) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MapInformationCard extends StatelessWidget {
  final String busNumber;
  final String routeName;
  final String scheduledTime;

  const MapInformationCard({
    super.key,
    required this.busNumber,
    required this.routeName,
    required this.scheduledTime,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
        boxShadow: AppShadows.subtle,
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: AppColors.primarySoft,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.route_rounded,
              color: AppColors.primaryNavy,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'المسار: $routeName',
                  style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 2),
                Text(
                  'حافلة رقم $busNumber • التوقيت: $scheduledTime',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.secondaryText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
