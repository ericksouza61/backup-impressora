[Version]
Class=IEXPRESS
SEDVersion=3

[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=0
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=I
InstallPrompt=%InstallPrompt%
DisplayLicense=%DisplayLicense%
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=%PostInstallCmd%
AdminQuietInstCmd=%AdminQuietInstCmd%
UserQuietInstCmd=%UserQuietInstCmd%
SourceFiles=SourceFiles
PackageInstall=Install
EarlyExtract=0
ExpectedFileCount=2

[Strings]
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=C:\Desenvolvemento\backupteste_v5.exe
FriendlyName=Backup Impressoras
AppLaunched=backupteste_run.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
FILE0=backupteste.bat
FILE1=backupteste_run.cmd

[SourceFiles]
SourceFiles0=C:\Desenvolvemento\
[SourceFiles0]
%FILE0%=
%FILE1%=
