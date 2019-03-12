<template>
  <div>
    <div class="contracts-block">
      <div class="left-block">
        <div class="block">
          <div class="head">
            <div class="left">Данные пользователя</div>
            <div class="right">
              <span v-if="blocksComplete.block1 === 'error'" class="red">Ошибка</span>
              <span v-else-if="blocksComplete.block1" class="green">Заполнен</span>
              <span v-else>Не заполнен</span>
            </div>
          </div>
          <div class="c-field">
            <label for="lastName" class="c-field__label">Фамилия:</label>
            <div class="c-input-wrapper">
              <input type="text" id="lastName" placeholder="ИВАНОВ" :class="'c-input' + (errorField === 'lastName' ? ' error' : '')" v-model="fields.lastName"
                     @input="fields.lastName = $event.target.value.toUpperCase()">
            </div>
          </div>
          <div class="c-field">
            <label for="firstName" class="c-field__label">Имя:</label>
            <div class="c-input-wrapper">
              <input type="text" id="firstName" placeholder="ИВАН" :class="'c-input' + (errorField === 'firstName' ? ' error' : '')" v-model="fields.firstName"
                     @input="fields.firstName = $event.target.value.toUpperCase()">
            </div>
          </div>
          <div class="c-field">
            <label for="secondName" class="c-field__label">Отчество:</label>
            <div class="c-input-wrapper">
              <input type="text" id="secondName" placeholder="ИВАНОВИЧ" :class="'c-input' + (errorField === 'secondName' ? ' error' : '')" v-model="fields.secondName"
                     @input="fields.secondName = $event.target.value.toUpperCase()">
            </div>
          </div>
          <div class="c-field">
            <label for="numberContract" class="c-field__label">Номер договора:</label>
            <div class="c-input-wrapper">
              <input type="text" id="numberContract" placeholder="20.12.18-1" :class="'c-input' + (errorField === 'numberContract' ? ' error' : '')" v-model="fields.numberContract">
            </div>
          </div>
          <div class="c-field">
            <label for="date" class="c-field__label">Дата договора:</label>
            <div class="c-input-wrapper">
              <input type="text" id="date" placeholder="10 июля 2019" :class="'c-input' + (errorField === 'date' ? ' error' : '')" v-model="fields.date">
            </div>
          </div>
          <div class="c-field">
            <label for="deadline" class="c-field__label">Срок выполнения работ:</label>
            <div class="c-input-wrapper">
              <input type="text" id="deadline" placeholder="1 ноября 2019" :class="'c-input' + (errorField === 'deadline' ? ' error' : '')" v-model="fields.deadline">
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Цена договора цифрами:</label>
            <div class="c-input-wrapper">
              <input type="text" id="priceNumber" placeholder="543 995" :class="'c-input' + (errorField === 'priceNumber' ? ' error' : '')" v-model="fields.priceNumber" v-on:keypress="isNumber($event)"
                     @input="fields.priceNumber = formattedNumber($event.target.value)">
            </div>
          </div>
          <div class="c-field">
            <label for="priceString" class="c-field__label">Цена договора прописью:</label>
            <div class="c-input-wrapper">
              <input type="text" id="priceString" placeholder="Пятьсот сорок три тысячи девятьсот девяносто пять" :class="'c-input' + (errorField === 'priceString' ? ' error' : '')"
                     v-model="fields.priceString">
            </div>
          </div>
        </div>
        <div class="block block-address">
          <div class="head">
            <div class="left">Место регистрации клиента</div>
            <div class="right">
              <span v-if="blocksComplete.block2 === 'error'" class="red">Ошибка</span>
              <span v-else-if="blocksComplete.block2" class="green">Заполнен</span>
              <span v-else>Не заполнен</span>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Город, посёлок:</label>
            <div class="c-input-wrapper">
              <v-autocomplete :items="suggests.register_city" placeholder="Санкт-Петербург" @update-items="updateSuggests($event, 'register_city', 'City')"
                              :auto-select-one-item="false" @change="fields.register_city = $event" @item-clicked="fields.register_city = $event"
                              @item-selected="fields.register_city = $event" :wait="0" :min-len="1"></v-autocomplete>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Улица, проспект:</label>
            <div class="c-input-wrapper">
              <v-autocomplete :items="suggests.register_street" placeholder="ул. Строителей" @update-items="updateSuggests($event, 'register_street', 'Street')"
                              :auto-select-one-item="false" @change="fields.register_street = $event" @item-clicked="fields.register_street = $event"
                              @item-selected="fields.register_street = $event" :wait="0" :min-len="1"></v-autocomplete>
            </div>
          </div>
          <div class="inline-fields">
            <label class="c-field__label"></label>
            <div class="inline-fields-inner">
              <div class="c-field">
                <label for="register_house" class="c-field__label">Дом:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="register_house" placeholder="14" maxlength="4" :class="'c-input' + (errorField === 'register_house' ? ' error' : '')" v-model="fields.register_house"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
              <div class="c-field">
                <label for="register_shell" class="c-field__label u-text-right">Корпус:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="register_shell" placeholder="1" maxlength="4" :class="'c-input' + (errorField === 'register_shell' ? ' error' : '')" v-model="fields.register_shell"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
              <div class="c-field">
                <label for="register_apart" class="c-field__label u-text-right">Квартира:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="register_apart" placeholder="28" maxlength="4" :class="'c-input' + (errorField === 'register_apart' ? ' error' : '')" v-model="fields.register_apart"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="block block-address u-border-bottom-zero">
          <div class="head">
            <div class="left">Адрес для корреспонденции</div>
            <div class="right">
              <span v-if="blocksComplete.block3 === 'error'" class="red">Ошибка</span>
              <span v-else-if="blocksComplete.block3" class="green">Заполнен</span>
              <span v-else>Не заполнен</span>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Город, посёлок:</label>
            <div class="c-input-wrapper">
              <v-autocomplete :items="suggests.addressCor_city" placeholder="Санкт-Петербург" @update-items="updateSuggests($event, 'addressCor_city', 'City')"
                              :auto-select-one-item="false" @change="fields.addressCor_city = $event" @item-clicked="fields.addressCor_city = $event"
                              @item-selected="fields.addressCor_city = $event" :wait="0" :min-len="1"></v-autocomplete>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Улица, проспект:</label>
            <div class="c-input-wrapper">
              <v-autocomplete :items="suggests.addressCor_street" placeholder="ул. Карпинского" @update-items="updateSuggests($event, 'addressCor_street', 'Street')"
                              :auto-select-one-item="false" @change="fields.addressCor_street = $event" @item-clicked="fields.addressCor_street = $event"
                              @item-selected="fields.addressCor_street = $event" :wait="0" :min-len="1"></v-autocomplete>
            </div>
          </div>
          <div class="inline-fields">
            <label class="c-field__label"></label>
            <div class="inline-fields-inner">
              <div class="c-field">
                <label for="addressCor_house" class="c-field__label">Дом:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="addressCor_house" placeholder="12" maxlength="4" :class="'c-input' + (errorField === 'addressCor_house' ? ' error' : '')" v-model="fields.addressCor_house"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
              <div class="c-field">
                <label for="addressCor_shell" class="c-field__label u-text-right">Корпус:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="addressCor_shell" placeholder="2" maxlength="4" :class="'c-input' + (errorField === 'addressCor_shell' ? ' error' : '')" v-model="fields.addressCor_shell"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
              <div class="c-field">
                <label for="addressCor_apart" class="c-field__label u-text-right">Квартира:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="addressCor_apart" placeholder="35" maxlength="4" :class="'c-input' + (errorField === 'addressCor_apart' ? ' error' : '')" v-model="fields.addressCor_apart"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-block">
        <div class="block block-address">
          <div class="head">
            <div class="left">Адрес объекта</div>
            <div class="right">
              <span v-if="blocksComplete.block4 === 'error'" class="red">Ошибка</span>
              <span v-else-if="blocksComplete.block4" class="green">Заполнен</span>
              <span v-else>Не заполнен</span>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Город, посёлок:</label>
            <div class="c-input-wrapper">
              <v-autocomplete :items="suggests.address_city" placeholder="Санкт-Петербург" value="Санкт-Петербург" @update-items="updateSuggests($event, 'address_city', 'City')"
                              :auto-select-one-item="false" @change="fields.address_city = $event" @item-clicked="fields.address_city = $event"
                              @item-selected="fields.address_city = $event" :wait="0" :min-len="1"></v-autocomplete>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Улица, проспект:</label>
            <div class="c-input-wrapper">
              <v-autocomplete :items="suggests.address_street" placeholder="ул. Карпинского" @update-items="updateSuggests($event, 'address_street', 'Street')"
                              :auto-select-one-item="false" @change="fields.address_street = $event" @item-clicked="fields.address_street = $event"
                              @item-selected="fields.address_street = $event" :wait="0" :min-len="1"></v-autocomplete>
            </div>
          </div>
          <div class="inline-fields">
            <label class="c-field__label"></label>
            <div class="inline-fields-inner">
              <div class="c-field">
                <label for="address_house" class="c-field__label">Дом:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="address_house" placeholder="12" maxlength="4" :class="'c-input' + (errorField === 'address_house' ? ' error' : '')" v-model="fields.address_house"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
              <div class="c-field">
                <label for="address_shell" class="c-field__label u-text-right">Корпус:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="address_shell" placeholder="2" maxlength="4" :class="'c-input' + (errorField === 'address_shell' ? ' error' : '')" v-model="fields.address_shell"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
              <div class="c-field">
                <label for="address_apart" class="c-field__label u-text-right">Квартира:</label>
                <div class="c-input-wrapper">
                  <input type="text" id="address_apart" placeholder="35" maxlength="4" :class="'c-input' + (errorField === 'address_apart' ? ' error' : '')" v-model="fields.address_apart"
                         v-on:keypress="isNumber($event)">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="head">
            <div class="left">Адреса и реквизиты клиента</div>
            <div class="right">
              <span v-if="blocksComplete.block5 === 'error'" class="red">Ошибка</span>
              <span v-else-if="blocksComplete.block5" class="green">Заполнен</span>
              <span v-else>Не заполнен</span>
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Дата рождения клиента:</label>
            <div class="c-input-wrapper">
              <masked-input :class="'c-input' + (errorField === 'birthday' ? ' error' : '')" v-model="fields.birthday" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ"></masked-input>
            </div>
          </div>
          <div class="c-field">
            <label for="place" class="c-field__label">Место рождения клиента:</label>
            <div class="c-input-wrapper">
              <input type="text" id="place" placeholder="Санкт-Петербург" :class="'c-input' + (errorField === 'place' ? ' error' : '')" v-model="fields.place">
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Телефон:</label>
            <div class="c-input-wrapper">
              <masked-input :class="'c-input' + (errorField === 'phone' ? ' error' : '')" v-model="fields.phone" mask="\+1 (111) 111-11-11" placeholder="+_ (___) ___-__-__"></masked-input>
            </div>
          </div>
          <div class="c-field">
            <label for="email" class="c-field__label">Почта:</label>
            <div class="c-input-wrapper">
              <input type="text" id="email" placeholder="mail@mail.ru" :class="'c-input' + (errorField === 'email' ? ' error' : '')" v-model="fields.email">
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Номер паспорта:</label>
            <div class="c-input-wrapper">
              <masked-input :class="'c-input' + (errorField === 'passport' ? ' error' : '')" v-model="fields.passport" mask="1111 111111" placeholder="1902 753824"></masked-input>
            </div>
          </div>
          <div class="c-field">
            <label for="placePassport" class="c-field__label">Выдан:</label>
            <div class="c-input-wrapper">
              <input type="text" id="placePassport" placeholder="Вологодская РОВД Вологодской области" :class="'c-input' + (errorField === 'placePassport' ? ' error' : '')" v-model="fields.placePassport">
            </div>
          </div>
          <div class="c-field">
            <label class="c-field__label">Дата выдачи:</label>
            <div class="c-input-wrapper">
              <masked-input :class="'c-input' + (errorField === 'datePassport' ? ' error' : '')" v-model="fields.datePassport" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ"></masked-input>
            </div>
          </div>
        </div>
        <div class="block u-border-bottom-zero block-min-height">
          <div class="head">
            <div class="left">
              <span v-if="selectMode === 1">Требуемые документы</span>
              <span v-if="selectMode === 2">Закупка материалов</span>
              <span v-if="selectMode === 3">Ориентация проекта</span>
              <span v-if="selectMode === 4">Вывоз мусора</span>
            </div>
            <div class="right selects-block">
              <div :class="'select' + (selectMode === 1 ? ' active' : '')" @click="selectMode = 1">1</div>
              <div :class="'select' + (selectMode === 2 ? ' active' : '')" @click="selectMode = 2">2</div>
              <div :class="'select' + (selectMode === 3 ? ' active' : '')" @click="selectMode = 3">3</div>
              <div :class="'select' + (selectMode === 4 ? ' active' : '')" @click="selectMode = 4">4</div>
            </div>
          </div>
          <div v-if="selectMode === 1">
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="documentAll" v-model="fields.documentsAll" @change="changeDocuments">
                <label for="documentAll" class="c-choice__label">Выбрать все</label>
              </div>
            </div>
            <div class="c-field">
              <hr class="hr-line">
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="document1" v-model="fields.documents.doc1">
                <label for="document1" class="c-choice__label">Договор подряда</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="document2" v-model="fields.documents.doc2">
                <label for="document2" class="c-choice__label">Акт передачи ключей</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="document3" v-model="fields.documents.doc3">
                <label for="document3" class="c-choice__label">Поручение на закупку материалов</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="document4" v-model="fields.documents.doc4">
                <label for="document4" class="c-choice__label">Проект</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="document5" v-model="fields.documents.doc5">
                <label for="document5" class="c-choice__label">Смета</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--checkbox">
                <input type="checkbox" class="c-choice__input" id="document6" v-model="fields.documents.doc6">
                <label for="document6" class="c-choice__label">Поручение на вывоз мусора</label>
              </div>
            </div>
          </div>
          <div v-if="selectMode === 2">
            <div class="c-field u-mb-xsmall">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="var1" name="vars" v-model="fields.variant" value="1">
                <label for="var1" class="c-choice__label">Мы - счёт / Заказчик оплатит
                  <button v-popover.right="{ name: 'var1' }" class="popover-button"><img src="/static/images/question.svg" class="question-img"></button>
                  <popover name="var1" class="u-mb-small">
                    <ol>
                      <li><b>Подрядчик</b> по заданию Заказчика обязуется <b>сформировать счет на оплату</b> с перечнем закупаемых материалов (черновых, чистовых и т.д.) и предоставить его Заказчику посредством электронной почты,
                        указанной в разделе 12 Договора</li>
                      <li><b>Заказчик</b> обязуется <b>оплатить представленный к оплате счет</b> в течение 2 (двух) календарных дней.</li>
                    </ol>
                  </popover>
                </label>
              </div>
            </div>
            <div class="c-field u-mb-xsmall">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="var2" name="vars" v-model="fields.variant" value="2">
                <label for="var2" class="c-choice__label">Мы - счёт / Заказчик - выдаёт деньги
                  <button v-popover.right="{ name: 'var2' }" class="popover-button"><img src="/static/images/question.svg" class="question-img"></button>
                  <popover name="var2" class="u-mb-small">
                    <ol>
                      <li><b>Подрядчик</b> по заданию Заказчика обязуется <b>сформировать перечень</b> закупаемых материалов (черновых, чистовых и т.д.) и предоставить его Заказчику посредством электронной почты,
                        указанной в разделе 12 Договора</li>
                      <li><b>Заказчик</b> обязуется <b>выдать Подрядчику необходимую для закупки материалов сумму</b> наличными средствами, либо перечислить их на расчетный счет Подрядчика в течение 2 (двух) календарных дней.</li>
                    </ol>
                  </popover>
                </label>
              </div>
            </div>
            <div class="c-field u-mb-xsmall">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="var3" name="vars" v-model="fields.variant" value="3">
                <label for="var3" class="c-choice__label">Заказчик выдаёт аванс на материалы
                  <button v-popover.right="{ name: 'var3' }" class="popover-button"><img src="/static/images/question.svg" class="question-img"></button>
                  <popover name="var3" class="u-mb-small">
                    <ol>
                      <li><b>Заказчик</b> поручает <b>Подрядчику</b> сформировать перечень закупаемых материалов (черновых, чистовых и т.д.) и доставить их на Объект, для чего предоставляет Подрядчику денежные средства
                        в размере ____ (____ ____) рублей 00 коп.</li>
                      <li><b>Подрядчик обязуется</b> сформировать перечень закупаемых материалов (черновых, чистовых и т.д.), доставить их на Объект и отчитаться перед Заказчиком, предоставив чеки об оплате
                        по электронной почте, указанной в договоре</li>
                    </ol>
                  </popover>
                </label>
              </div>
            </div>
            <div class="c-field" v-if="fields.variant === '3'">
              <label for="materialsNumber" class="c-field__label">Средства на материалы цифрами:</label>
              <div class="c-input-wrapper">
                <input type="text" id="materialsNumber" placeholder="124 598" :class="'c-input' + (errorField === 'materialsNumber' ? ' error' : '')" v-model="fields.materialsNumber"
                       v-on:keypress="isNumber($event)" @input="fields.materialsNumber = formattedNumber($event.target.value)">
              </div>
            </div>
            <div class="c-field" v-if="fields.variant === '3'">
              <label for="materialsString" class="c-field__label">Средства на материалы прописью:</label>
              <div class="c-input-wrapper">
                <input type="text" id="materialsString" placeholder="Сто двадцать четыре тысячи пятьсот девяносто восемь" :class="'c-input' + (errorField === 'materialsString' ? ' error' : '')"
                       v-model="fields.materialsString">
              </div>
            </div>
          </div>
          <div v-if="selectMode === 3">
            <div class="c-field">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="projVert" name="proj" v-model="fields.project" value="vertical">
                <label for="projVert" class="c-choice__label">Вертикальная</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="projHoriz" name="proj" v-model="fields.project" value="horizontal">
                <label for="projHoriz" class="c-choice__label">Горизонтальная</label>
              </div>
            </div>
          </div>
          <div v-if="selectMode === 4">
            <div class="c-field">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="trash1" name="trash" v-model="fields.trash" value="1">
                <label for="trash1" class="c-choice__label">Передать транспортной компании</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="trash2" name="trash" v-model="fields.trash" value="2">
                <label for="trash2" class="c-choice__label">Выкинуть в контейнер</label>
              </div>
            </div>
            <div class="c-field">
              <div class="c-choice c-choice--radio">
                <input type="radio" class="c-choice__input" id="trash3" name="trash" v-model="fields.trash" value="3">
                <label for="trash3" class="c-choice__label">Сам выносит</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="button" :class="'download-button' + (blocksComplete.blocksAll ? ' active' : '')" @click="downloadContracts">Скачать архив</button>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import dateMixin from '@/mixins/dateMixin.vue';
  import DatePicker from 'vue2-datepicker';
  import MaskedInput from 'vue-masked-input';
  import Autocomplete from 'v-autocomplete';
  import 'v-autocomplete/dist/v-autocomplete.css';
  const pageData = { title: 'Создание договора подряда и приложений', metaTitle : 'Создание договора подряда и приложений' };
  export default {
    mixins: [Component, dateMixin],
    data() {
      return {
        pageData: pageData,
        fields: {
          lastName: '',
          firstName: '',
          secondName: '',
          numberContract: '',
          date: '',
          address_city: 'Санкт-Петербург',
          address_street: '',
          address_house: '',
          address_shell: '',
          address_apart: '',
          deadline: '',
          priceNumber: '',
          priceString: '',
          birthday: '',
          place: '',
          passport: '',
          placePassport: '',
          datePassport: '',
          register_city: '',
          register_street: '',
          register_house: '',
          register_shell: '',
          register_apart: '',
          addressCor_city: '',
          addressCor_street: '',
          addressCor_house: '',
          addressCor_shell: '',
          addressCor_apart: '',
          phone: '',
          email: '',
          variant: 1,
          materialsNumber: '',
          materialsString: '',
          project: 'vertical',
          trash: 1,
          documents: {
            doc1: true,
            doc2: true,
            doc3: true,
            doc4: true,
            doc5: true,
            doc6: true
          },
          documentsAll: true
        },
        selectMode: 1,
        blocksComplete: {
          block1: false,
          block2: false,
          block3: false,
          block4: false,
          block5: false,
          blocksAll: false
        },
        errorField: '',
        serverURL: '',
        suggests: {
          address_city: [],
          address_street: [],
          register_city: [],
          register_street: [],
          addressCor_city: [],
          addressCor_street: []
        }
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      this.serverURL = window.axios.defaults.baseURL;
      this.fields.numberContract = await this.checkContracts(this.currentSlimDateWithZero + '-1');
      this.fields.date = this.currentFullDate;
      this.$store.dispatch('setComponentReady', true);
    },
    watch: {
      'fields.priceNumber'() {
        let number = this.fields.priceNumber.replace(new RegExp(' ', 'g'), '');
        this.fields.priceString = this.number_to_string(number);
      },
      'fields.materialsNumber'() {
        let number = this.fields.materialsNumber.replace(new RegExp(' ', 'g'), '');
        this.fields.materialsString = this.number_to_string(number);
      },
      'fields.trashNumber'() {
        let number = this.fields.trashNumber.replace(new RegExp(' ', 'g'), '');
        this.fields.trashString = this.number_to_string(number);
      },
      'fields.documents': {
        handler: function() {
          let arr = ['doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'doc6'];
          let selectAll = true;
          arr.forEach((el) => {
            if (!this.fields.documents[el]) {
              selectAll = false;
            }
          });
          this.fields.documentsAll = selectAll;
        },
        deep: true
      },
      fields: {
        handler: function() {
          this.errorField = '';

          this.blocksComplete.block1 = (this.fields.lastName !== '' && this.fields.firstName !== '' && this.fields.secondName !== '' && this.fields.numberContract !== '' && this.fields.date !== '' &&
            this.fields.deadline !== '' && this.fields.priceNumber !== '' && this.fields.priceString !== '');

          this.blocksComplete.block2 = (this.fields.register_city !== '' && this.fields.register_street !== '' && this.fields.register_house !== '');

          this.blocksComplete.block3 = (this.fields.addressCor_city !== '' && this.fields.addressCor_street !== '' && this.fields.addressCor_house !== '');

          this.blocksComplete.block4 = (this.fields.address_city !== '' && this.fields.address_street !== '' && this.fields.address_house !== '');

          this.blocksComplete.block5 = (this.fields.birthday !== '' && this.fields.place !== '' && this.fields.phone !== '' && this.fields.email !== '' && this.fields.passport !== '' &&
            this.fields.placePassport !== '' && this.fields.datePassport !== '');

          this.blocksComplete.blocksAll = this.blocksComplete.block1 && this.blocksComplete.block2 && this.blocksComplete.block4 && this.blocksComplete.block5;
        },
        deep: true
      }
    },
    methods: {
      async updateSuggests(value, field, type) {
        if (value.length < 3) {
          this.suggests[field] = [];
        } else {
          let resp = await axios.post('/check' + type, { 'value': value });
          if (resp.data) {
            this.suggests[field] = resp.data;
          }
        }
      },
      changeDocuments() {
        let arr = ['doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'doc6'];
        arr.forEach((el) => {
          this.fields.documents[el] = this.fields.documentsAll;
        });
      },
      async checkContracts(number) {
        let resp = await axios.post('/checkContracts', { number: number });
        if (resp.data) {
          if (resp.data.result) {
            return resp.data.result;
          }
        } else {
          return number;
        }
      },
      async downloadContracts() {
        if (!this.validateFields()) {
          return false;
        }
        let resp = await axios.post('/createContracts', this.fields);
        if (resp.data) {
          if (resp.data.filename) {
            let address = window.axios.defaults.baseURL;
            address = address.replace('api', '');
            let link = document.createElement('a');
            let href = address + resp.data.filename;
            link.setAttribute('href', href);
            link.setAttribute('download', resp.data.filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            toastr.error(resp.data.display);
            this.errorField = resp.data.field;
            this.blocksComplete[resp.data.block] = 'error';
          }
        }
      },
      validateFields() {
        let arr = [{
          field: 'lastName',
          name: 'Фамилия',
          block: 'block1'
        }, {
          field: 'firstName',
          name: 'Имя',
          block: 'block1'
        }, {
          field: 'secondName',
          name: 'Отчество',
          block: 'block1'
        }, {
          field: 'numberContract',
          name: 'Номер договора',
          block: 'block1'
        }, {
          field: 'date',
          name: 'Дата договора',
          block: 'block1'
        }, {
          field: 'address_city',
          name: 'Адрес объекта - Город, посёлок',
          block: 'block4'
        }, {
          field: 'address_street',
          name: 'Адрес объекта - Улица, проспект',
          block: 'block4'
        }, {
          field: 'address_house',
          name: 'Адрес объекта - Дом',
          block: 'block4'
        }, {
          field: 'deadline',
          name: 'Срок выполнения работ',
          block: 'block1'
        }, {
          field: 'priceNumber',
          name: 'Цена договора цифрами',
          block: 'block1'
        }, {
          field: 'priceString',
          name: 'Цена договора прописью',
          block: 'block1'
        }, {
          field: 'birthday',
          name: 'Дата рождения клиента',
          block: 'block5'
        }, {
          field: 'place',
          name: 'Место рождения клиента',
          block: 'block5'
        }, {
          field: 'passport',
          name: 'Номер паспорта',
          block: 'block5'
        }, {
          field: 'placePassport',
          name: 'Выдан',
          block: 'block5'
        }, {
          field: 'datePassport',
          name: 'Дата выдачи',
          block: 'block5'
        }, {
          field: 'register_city',
          name: 'Место регистрации клиента - Город, посёлок',
          block: 'block2'
        }, {
          field: 'register_street',
          name: 'Место регистрации клиента - Улица, проспект',
          block: 'block2'
        }, {
          field: 'register_house',
          name: 'Место регистрации клиента - Дом',
          block: 'block2'
        }, {
          field: 'phone',
          name: 'Телефон',
          block: 'block5'
        }, {
          field: 'email',
          name: 'Почта',
          block: 'block5'
        }];
        for (let i = 0; i < arr.length; i++) {
          if (this.fields[arr[i].field].trim() === '') {
            toastr.error('Поле "' + arr[i].name + '" не может быть пустое');
            this.errorField = arr[i].field;
            this.blocksComplete[arr[i].block] = 'error';
            return false;
          }
        }
        return true;
      },
      isNumber(evt) {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault();
        } else {
          return true;
        }
      },
      formattedNumber(value) {
        if (value === '') {
          return '';
        }
        value = value.replace(new RegExp(' ', 'g'), '');
        return new Intl.NumberFormat().format(value);
      },
      number_to_string(_number) {
        var _arr_numbers = [];
        _arr_numbers[1] = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
        _arr_numbers[2] = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
        _arr_numbers[3] = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
        function number_parser(_num, _desc) {
            var _string = '';
            var _num_hundred = '';
            if (_num.length == 3) {
              _num_hundred = _num.substr(0, 1);
              _num = _num.substr(1, 3);
              _string = _arr_numbers[3][_num_hundred] + ' ';
            }
            if (_num < 20) _string += _arr_numbers[1][parseFloat(_num)] + ' ';
            else {
              let _first_num = _num.substr(0, 1);
              let _second_num = _num.substr(1, 2);
              _string += _arr_numbers[2][_first_num] + ' ' + _arr_numbers[1][_second_num] + ' ';
            }
            switch (_desc){
              case 0:
                break;
              case 1:
                var _last_num = parseFloat(_num.substr(-1));
                var pre_last_num = _num.substr(-2);
                pre_last_num = pre_last_num.split("");
                var _pre_last_num = parseFloat(pre_last_num[0]);
                if (_last_num == 1 && 1!=_pre_last_num) _string += 'тысяча ';
                else if (_last_num == 1 && 1 == pre_last_num.length) _string += 'тысяча ';
                else if (_last_num > 1 && _last_num < 5 && 1!=_pre_last_num) _string += 'тысячи ';
                else _string += 'тысяч ';
                _string = _string.replace('один ', 'одна ');
                _string = _string.replace('два ', 'две ');
                break;
              case 2:
                var _last_num = parseFloat(_num.substr(-1));
                var pre_last_num = _num.substr(-2);
                pre_last_num = pre_last_num.split("");
                var _pre_last_num = parseFloat(pre_last_num[0]);
                if (_last_num == 1 && 1!=_pre_last_num) _string += 'миллион ';
                else if (_last_num == 1 && 1 == pre_last_num.length) _string += 'миллион ';
                else if (_last_num > 1 && _last_num < 5 && 1!=_pre_last_num) _string += 'миллиона ';
                else _string += 'миллионов ';
                break;
              case 3:
                var _last_num = parseFloat(_num.substr(-1));
                var pre_last_num = _num.substr(-2);
                pre_last_num = pre_last_num.split("");
                var _pre_last_num = parseFloat(pre_last_num[0]);
                if (_last_num == 1 && 1!=_pre_last_num) _string += 'миллиард ';
                else if (_last_num == 1 && 1 == pre_last_num.length) _string += 'миллиард ';
                else if (_last_num > 1 && _last_num < 5 && 1!=_pre_last_num) _string += 'миллиарда ';
                else _string += 'миллиардов ';
                break;
            }
            _string = _string.replace('  ', ' ');
            return _string;
        }
        if (!_number || _number == 0) return '';
        if (typeof _number !== 'number') {
          _number = _number.replace(',', '.');
          _number = parseFloat(_number);
          if (isNaN(_number)) return '';
        }
        _number = _number.toFixed(2);
        if(_number.indexOf('.') != -1) {
          var _number_arr = _number.split('.');
          var _number = _number_arr[0];
        }
        var _number_length = _number.length;
        var _string = '';
        var _num_parser = '';
        var _count = 0;
        for (let _p = (_number_length - 1); _p >= 0; _p--) {
          var _num_digit = _number.substr(_p, 1);
          _num_parser = _num_digit +  _num_parser;
          if ((_num_parser.length == 3 || _p == 0) && !isNaN(parseFloat(_num_parser))) {
            _string = number_parser(_num_parser, _count) + _string;
            _num_parser = '';
            _count++;
          }
        }
        _string=_string.charAt(0).toUpperCase() + _string.substr(1).toLowerCase();
        return _string.trim();
      }
    },
    components: {
      MaskedInput,
      DatePicker,
      'v-autocomplete': Autocomplete
    }
  }
</script>
