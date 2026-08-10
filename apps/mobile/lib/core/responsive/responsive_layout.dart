import 'package:flutter/material.dart';
import 'breakpoints.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;

  const ResponsiveLayout({super.key, required this.mobile, this.tablet});

  static bool isSmallMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < Breakpoints.mobileMedium;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= Breakpoints.tabletSmall;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= Breakpoints.tabletSmall && tablet != null) {
          return tablet!;
        }
        return mobile;
      },
    );
  }
}
