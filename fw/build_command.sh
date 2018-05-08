#!/bin/bash
MIX_TARGET=rpi3 KIOSK_URL="http://0.0.0.0" mix do deps.get, firmware, firmware.burn
