import {useState} from "react";

export default function More_details() {
    return (
        <>
            <h1>Резюме</h1>

            <h2>Кратко о пути</h2>

            <p>
                Кодить начал в 12 лет (1992 год) — УК-НЦ.
                В 1994 появился личный ПК «Поиск» (IBM-архитектура, 8087 с сопроцессором).
                С 1997 года — коммерческая разработка под заказ.
            </p>

            <p>
                Работал с разными архитектурами, языками и подходами,
                по мере развития платформ и задач.
                Более подробно мой основной стек и профиль —
                на сайте-визитке <a href="https://sy-soft.net" target="_blank">SY-Soft.net</a>.
            </p>

            <h2>Опыт</h2>

            <ul>
                <li>
                    <strong>1997 – настоящее время</strong> — коммерческая разработка.
                    Форматы: штат / удалёнка / фриланс.
                    Полный цикл: анализ → ТЗ → разработка → внедрение → поддержка.
                </li>
                <li>
                    <strong>2007</strong> — хостинговая компания и web-студия.
                    Переход в веб-разработку.
                </li>
                <li>
                    <strong>2008</strong> — ООО с ИИ «ЧИП» (сеть «УмаПалата»).
                    Есть рекомендательное письмо от непосредственного руководителя.
                     <a href="/public/scan_CHIP.jpg" target="_blank">Скан письма</a>
                </li>
                <li>
                    Далее — долгосрочные проекты и фриланс.
                    Подтверждение опыта — публичные отзывы заказчиков.
                </li>
            </ul>

            <h2>Технологии (кратко)</h2>

            <ul>
                <li><strong>Frontend:</strong> HTML, CSS, JavaScript, React, Bootstrap</li>
                <li><strong>Backend:</strong> PHP</li>
                <li><strong>CMS / Frameworks:</strong> Drupal (использую как фреймворк)</li>
                <li><strong>Базы данных:</strong> MySQL</li>
                <li><strong>Интеграции:</strong> REST API, JSON, JWT</li>
            </ul>

            <p>
                Полный и исторически накопленный стек —
                на <a href="https://sy-soft.net" target="_blank">SY-Soft.net</a>.
            </p>

            <h2>Крайний проект</h2>

            <p>
                <a href="https://vchaspik.ua" target="_blank">vchaspik.ua</a> —
                пример использования Drupal как прикладного фреймворка.
                Около 95% логики реализовано вне стандартных CMS-механик.
                При необходимости могу предоставить доступ к закрытой версии
                для просмотра архитектуры и решений.
            </p>

            <h2>Отзывы</h2>

            <ul>
                <li><a href="https://www.weblancer.net/users/SYuri/reviews/" target="_blank">Weblancer</a></li>
                <li><a href="https://www.fl.ru/users/syuri/opinions/" target="_blank">FL.ru</a></li>
                <li><a href="https://freelancehunt.com/freelancer/SYuri.html#reviews" target="_blank">Freelancehunt</a>
                </li>
                <li><a href="https://freelance.ru/reviews/SYuri/" target="_blank">Freelance.ru</a></li>
            </ul>

            <h2>О React</h2>

            <p>
                React начал изучать 7 декабря.
                Самостоятельно сформулировал ТЗ и реализовывал его,
                используя документацию, поиск и GPT как вспомогательный инструмент.
                Задачу довёл до рабочего состояния.
            </p>

            <p>
                Считаю важным честно обозначить текущий уровень:
                идею и принципы React я понял,
                но осознаю, что потребуется время,
                чтобы полностью перестроить мышление
                с процедурного и классического ООП
                (FoxPro, Visual Basic, Delphi, PHP)
                на React-подход.
            </p>

            <p>
                В рамках проекта реализована «псевдо-админка»:
                CRUD, JWT-авторизация, JSON API.
                Работа с SQL, HTML, CSS, Bootstrap —
                базовый и давно освоенный уровень.
            </p>

            <p>
                Я пишу это не из самокритики,
                а чтобы не вводить будущего работодателя в заблуждение.
                Мне важна не формальная «ставка»,
                а честно заработанная оплата за реальный вклад.
            </p>

        </>
    );
}
