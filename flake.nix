{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, utils, ... }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        dotnet-sdk = pkgs.dotnetCorePackages.sdk_9_0-bin;
        java-jdk = pkgs.jdk21;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            python3
            bun
            dotnet-sdk
            java-jdk
            maven
          ];

          shellHook = ''
            export DOTNET_ROOT="${dotnet-sdk}";
            export JAVA_HOME="${java-jdk.home}";
          '';
        };
      }
    );
}
