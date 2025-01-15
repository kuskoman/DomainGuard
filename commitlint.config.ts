import {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
} from "@commitlint/types";
import versionrc from "./.versionrc.json" assert { type: "json" };

const commitTypes = versionrc.types.map((type) => type.type);

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [RuleConfigSeverity.Error, "always", commitTypes],
    "subject-case": [RuleConfigSeverity.Error, "never"],
    "scope-empty": [RuleConfigSeverity.Error, "never"],
  },
};
