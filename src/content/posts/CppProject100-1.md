---
title: C++ 로 100가지 프로젝트 만들기 - 1
published: 2025-06-13
description: 계산기
tags: [Cpp, 개발]
category: Cpp
draft: false 
lang: ''
---
> **Warning**
> c++ 을 어느정도 안다는 전제하여 작성된 글입니다.

# C++ 100가지 프로젝트 - 1: 계산기 만들기

## 프로젝트를 시작하며

C++을 학습하던 중 실력이 더 이상 늘지 않는 정체기를 맞이하게 되었습니다. 이에 따라 AI에게 초급부터 심화 순으로 적절한 프로젝트 주제를 추천받았고, 그 첫 번째로 계산기 만들기를 선택하게 되었습니다.

---

# 계산기 만들기

## 1.구상
이번 프로젝트에서는 간단한 콘솔 기반 계산기를 구현합니다. 주요 기능은 다음과 같습니다:

1. 사칙연산(더하기, 빼기, 곱하기, 나누기)

2. 거듭제곱 계산

3. 사용자 입력을 통한 연산 선택 및 숫자 입력

4. 결과 출력 및 예외 처리

## 2.전체코드
```cpp
#include <iostream>
#include <cmath>
#include <string>
#include <stdexcept>

class Calculator {
public:
    double add(double a, double b) {
        return a + b;
    }

    double subtract(double a, double b) {
        return a - b;
    }

    double multiply(double a, double b) {
        return a * b;
    }

    double divide(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("0으로는 나눌 수 없습니다.");
        }
        return a / b;
    }

    double power(double a, double exponent) {
        if (a == 0 && exponent == 0) {
            return 1; // 정의상 0^0은 1로 처리
        }
        return std::pow(a, exponent);
    }
};

int main() {
    Calculator calc;
    double a, b;
    std::string operation;

    std::cout << "원하시는 연산을 선택하세요 (+, -, *, /, **): ";
    std::cin >> operation;
    std::cout << "두 숫자를 입력하세요: ";
    std::cin >> a >> b;

    try {
        if (operation == "+") {
            std::cout << "결과: " << calc.add(a, b) << std::endl;
        } else if (operation == "-") {
            std::cout << "결과: " << calc.subtract(a, b) << std::endl;
        } else if (operation == "*") {
            std::cout << "결과: " << calc.multiply(a, b) << std::endl;
        } else if (operation == "/") {
            std::cout << "결과: " << calc.divide(a, b) << std::endl;
        } else if (operation == "**") {
            std::cout << "결과: " << calc.power(a, b) << std::endl;
        } else {
            std::cout << "잘못된 연산입니다." << std::endl;
        }
    } catch (const std::invalid_argument& e) {
        std::cout << "오류: " << e.what() << std::endl;
    }

    return 0;
}
```

## 3.코드 설명
1. ✅ 클래스 구조
    연산 기능을 하나의 Calculator 클래스에 정리하여 코드의 재사용성과 가독성을 높였습니다.

2. ✅ 함수 설계
    모든 함수는 double형 인자를 받아 연산 결과를 double로 반환합니다. 나눗셈 함수에서는 분모가 0인 경우 예외를 발생시켜 안전하게 처리합니다.

3.✅ 예외 처리
    예외 처리는 try-catch 문을 통해 사용자에게 친절하게 오류 메시지를 출력합니다. 예외 메시지는 std::invalid_argument 객체로부터 받아옵니다.

4.✅ 사용자 입력
    연산 기호와 숫자 두 개를 입력받아 조건문을 통해 알맞은 연산을 수행합니다. 거듭제곱은 ** 기호를 사용하도록 했습니다.

---

# 마치며

다음 프로젝트는 계산기 입니다