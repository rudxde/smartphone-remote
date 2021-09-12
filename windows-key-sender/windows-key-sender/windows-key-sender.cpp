#include <windows.h>
#include <stdio.h>


void KeyDown(char keyCode) {
    INPUT inputs[1] = {};
    ZeroMemory(inputs, sizeof(inputs));
    inputs[0].type = INPUT_KEYBOARD;
    inputs[0].ki.wVk = keyCode;
    UINT uSent = SendInput(ARRAYSIZE(inputs), inputs, sizeof(INPUT));
    if (uSent != ARRAYSIZE(inputs))
    {
        printf("SendInput failed: 0x%x\n", HRESULT_FROM_WIN32(GetLastError()));
    }
}

void KeyUp(char keyCode) {
    INPUT inputs[1] = {};
    ZeroMemory(inputs, sizeof(inputs));
    inputs[0].type = INPUT_KEYBOARD;
    inputs[0].ki.wVk = keyCode;
    inputs[0].ki.dwFlags = KEYEVENTF_KEYUP;
    UINT uSent = SendInput(ARRAYSIZE(inputs), inputs, sizeof(INPUT));
    if (uSent != ARRAYSIZE(inputs))
    {
        printf("SendInput failed: 0x%x\n", HRESULT_FROM_WIN32(GetLastError()));
    }
}


void KeyPress(char keyCode) {
    INPUT inputs[2] = {};
    ZeroMemory(inputs, sizeof(inputs));
    inputs[0].type = INPUT_KEYBOARD;
    inputs[0].ki.wVk = keyCode;

    inputs[1].type = INPUT_KEYBOARD;
    inputs[1].ki.wVk = keyCode;
    inputs[1].ki.dwFlags = KEYEVENTF_KEYUP;
    UINT uSent = SendInput(ARRAYSIZE(inputs), inputs, sizeof(INPUT));
    if (uSent != ARRAYSIZE(inputs))
    {
        printf("SendInput failed: 0x%x\n", HRESULT_FROM_WIN32(GetLastError()));
    }
}

int main()
{
    const char PRESS = 1;
    const char KEY_DOWN = 2;
    const char KEY_UP = 3;
    char ch;
    char mode = 0;
    while ((ch = getchar()) != EOF)
    {
        if (ch == 0) {
            mode = 0;
            continue;
        }
        if (mode == 0) {
            mode = ch;
            continue;
        }
        switch (mode) {
            case PRESS:
                KeyPress(ch);
                break;
            case KEY_DOWN:
                KeyDown(ch);
                break;
            case KEY_UP:
                KeyUp(ch);
                break;
            default:
                printf("unknown mode: 0x%02hhx for key 0x%02hhx \n", mode, ch);
        }
    }
    return 0;
}
