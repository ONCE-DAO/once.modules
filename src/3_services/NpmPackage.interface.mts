export default interface NpmPackage {
  path?: string;
  name?: string;
  version?: string;
  namespace?: string;
  linkPackage?: boolean;
  scripts?: any;
  onceDependencies?: string[];
}
