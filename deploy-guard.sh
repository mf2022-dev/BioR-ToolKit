#!/usr/bin/env bash
# ================================================================
#  DEPLOYMENT GUARD — Prevents cross-project deployment accidents
# ================================================================
#  Usage:  bash deploy-guard.sh <expected-project-name>
#
#  This script checks:
#    1. You are in the correct directory
#    2. The target project name matches the expected one
#    3. You are NOT accidentally deploying to "bior" from this repo
#
#  RULE:
#    /home/user/webapp       → ONLY deploys to "tabletap"
#    /home/user/bior-toolkit → ONLY deploys to "bior"
# ================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

EXPECTED_PROJECT="$1"
CURRENT_DIR="$(pwd)"
DIR_NAME="$(basename "$CURRENT_DIR")"

echo ""
echo -e "${YELLOW}===== DEPLOYMENT SAFETY CHECK =====${NC}"
echo ""

# ── Check 1: Was a project name provided? ──
if [ -z "$EXPECTED_PROJECT" ]; then
  echo -e "${RED}BLOCKED: No project name specified.${NC}"
  echo "Usage: bash deploy-guard.sh <project-name>"
  echo ""
  exit 1
fi

# ── Check 2: Block deploying to "bior" from the webapp directory ──
if [ "$EXPECTED_PROJECT" = "bior" ] && [[ "$CURRENT_DIR" == *"/webapp"* ]]; then
  echo -e "${RED}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!${NC}"
  echo -e "${RED}  BLOCKED — YOU ARE IN THE TABLETAP (webapp) DIRECTORY${NC}"
  echo -e "${RED}  Deploying to 'bior' from here will DESTROY bior.tech${NC}"
  echo -e "${RED}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!${NC}"
  echo ""
  echo -e "  To deploy bior.tech, run from:  ${GREEN}cd /home/user/bior-toolkit${NC}"
  echo ""
  exit 1
fi

# ── Check 3: Block deploying to "tabletap" from the bior-toolkit directory ──
if [ "$EXPECTED_PROJECT" = "tabletap" ] && [[ "$CURRENT_DIR" == *"/bior-toolkit"* ]]; then
  echo -e "${RED}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!${NC}"
  echo -e "${RED}  BLOCKED — YOU ARE IN THE BIOR-TOOLKIT DIRECTORY     ${NC}"
  echo -e "${RED}  Deploying to 'tabletap' from here will DESTROY TableTap${NC}"
  echo -e "${RED}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!${NC}"
  echo ""
  echo -e "  To deploy TableTap, run from:  ${GREEN}cd /home/user/webapp${NC}"
  echo ""
  exit 1
fi

# ── Check 4: Validate directory-to-project mapping ──
if [[ "$CURRENT_DIR" == *"/webapp"* ]] && [ "$EXPECTED_PROJECT" != "tabletap" ]; then
  echo -e "${RED}BLOCKED: This directory (webapp) should ONLY deploy to 'tabletap'.${NC}"
  echo -e "  You tried to deploy to: ${RED}$EXPECTED_PROJECT${NC}"
  echo -e "  Allowed target:         ${GREEN}tabletap${NC}"
  echo ""
  exit 1
fi

if [[ "$CURRENT_DIR" == *"/bior-toolkit"* ]] && [ "$EXPECTED_PROJECT" != "bior" ]; then
  echo -e "${RED}BLOCKED: This directory (bior-toolkit) should ONLY deploy to 'bior'.${NC}"
  echo -e "  You tried to deploy to: ${RED}$EXPECTED_PROJECT${NC}"
  echo -e "  Allowed target:         ${GREEN}bior${NC}"
  echo ""
  exit 1
fi

# ── All checks passed ──
echo -e "${GREEN}  Directory:  $CURRENT_DIR${NC}"
echo -e "${GREEN}  Target:     $EXPECTED_PROJECT${NC}"
echo -e "${GREEN}  Status:     SAFE TO DEPLOY${NC}"
echo ""
