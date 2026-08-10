import 'dart:io';

void main() {
  final f1 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart');
  String c1 = f1.readAsStringSync();
  
  c1 = c1.replaceAll('        ),\n      ),\n\n  \n      },', '        ),\n      );\n      },');
  
  c1 = c1.replaceAll('      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \\\$error"))),\n}\n}', '      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \\\$error"))),\n    );\n  }\n}');

  c1 = c1.replaceAll('        Text(label, style: AppTypography.caption),\n      ],\n\n  }\n}', '        Text(label, style: AppTypography.caption),\n      ],\n    );\n  }\n}');

  f1.writeAsStringSync(c1);
}
