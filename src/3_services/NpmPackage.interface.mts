export default interface NpmPackage {
  path?: string;
  name: string;
  version?: string;
  package: string;
  namespace?: string;
  linkPackage?: boolean;
  scripts?: any;
  devDependencies?: any;
  onceDependencies?: string[];
}
