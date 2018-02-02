<template>
  <div id="vcom-calendar" class="vcom-calendar">
    <div class="header">
      <div class="head">
        <span class="month-select" @click="adjustMonth(-1)">&lt;</span>
        {{ year }} - {{ pad(month, 2) }}
        <span class="month-select" @click="adjustMonth(1)">&gt;</span>
      </div>
      <div class="weeks">
        <span v-for="week in weeks" class="week">
          {{ week }}
        </span>
      </div>
    </div>
    <div class="days">
      <span class="day" v-for="day in days" track-by="$index" @click="select(day)">
          <span v-if="day.isToday" class="today this-month-day" :class="{ active: isSelected(day) }" :data-month="day.year + '-' + day.month + '-' + day.day">
            {{ day.day }}
            <br />
            <span v-html="getData(day.day)"></span>
          </span>
          <span v-if="day.isPreMonth || day.isNextMonth" class="not-this-month" :data-month="day.year + '-' + day.month + '-' + day.day">
            {{ day.day }}
          </span>
          <span v-if="day.isThisMonthDay && !day.isToday" class="this-month-day" :class="{ active: isSelected(day) }" :data-month="day.year + '-' + day.month + '-' + day.day">
            {{ day.day }}
            <br />
            <span v-html="getData(day.day)"></span>
          </span>
      </span>
    </div>
  </div>
</template>

<script>
  const MATRIX_MAX = 7 * 6,
        WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let bMonthRe = /^1?$|3|5|7|8|10|12/;

  export default {
    props: {
      getData: {
        type: Function,
        required: true
      },
      selected: {
        type: Date
      }
    },

    data() {
      return {
        time: this.selected || new Date(),
        weeks: WEEKS
      }
    },

    computed: {
      isRunYear() {
        return ((this.year % 4 === 0) && (this.year % 100 !== 0));
      },

      firstDayWeek() {
        return new Date(
          this.year
          , this.month - 1
          , 1
        )
        .getDay();
      },

      year() {
        return this.time.getFullYear()
      },

      month() {
        return this.time.getMonth() + 1
      },

      days() {
        return this.getDaysList();
      },

      currentDay() {
        return this.time.getDate();
      },

      currentMonth() {
        return (new Date()).getMonth() + 1;
      }
    },

    methods: {
      pad(num, size) {
        var s = num + "";
        while(s.length < size) {
          s = "0" + s;
        }
        return s;
      },

      adjustMonth(count) {
        var time = new Date(this.time);
        time.setMonth(time.getMonth() + count);
        this.time = time;
        this.$emit('change:month', { year: time.getFullYear(), month: time.getMonth() + 1 });
      },

      select(day) {
        this.$emit('select', day, this.month, this.year);
      },

      isSelected(day) {
        return this.selected.getFullYear() == day.year && this.selected.getMonth() + 1 == day.month && this.selected.getDate() == day.day;
      },

      _getPreMonthDays(month, offset) {
        if(offset === 0) {
          return [];
        } else if(month === 1) {
          return this.getDays(12).slice(-offset);
        } else {
          return this.getDays(month - 1).slice(-offset);
        }
      },

      _getNextMonthDays(month, offset) {
        if(month === 12) {
          return this.getDays(1).slice(0, offset);
        } else {
          return this.getDays(month + 1).slice(0, offset);
        }
      },

      _getRangeList(range, start) {
        var i = start || 1, _list = [];
        for(;i <= range;i ++) {
          _list.push(i);
        }
        return _list;
      },

      getDays(month) {
        if(bMonthRe.test(month)) {
          return this._getRangeList(31);
        } else if(month === 2) {
          if(this.isRunYear) {
            return this._getRangeList(29);
          } else {
            return this._getRangeList(28);
          }
        } else {
          return this._getRangeList(30);
        }
      },

      getDaysList() {
        let _needConcatLength = this.getDays(this.month).length + this.firstDayWeek;
        // debugger;
        let _initList = this._getPreMonthDays(this.month, this.firstDayWeek)
            .map((preMonthday) => {
              return {
                'year': this.month === 1 ? this.year - 1 : this.year,
                'month': this.month === 1 ? 12 : this.month - 1,
                'day': preMonthday,
                'isPreMonth': true
              };
            });

        if(MATRIX_MAX <= _needConcatLength) {
          let _thisMonthDaysList = this.getDays(this.month).slice(
            0
            , this.getDays(this.month).length - (_needConcatLength - MATRIX_MAX)
          )
          return _initList
            .concat(_thisMonthDaysList.map((day) => {
              let _dateObj = {
                'year': this.year,
                'month': this.month,
                'isThisMonthDay': true,
                'day': day
              };
              if(day === this.currentDay && this.month === this.currentMonth) {
                  _dateObj.isToday = true;
              }
              return _dateObj;
            }));
        } else {
          return _initList
          .concat(this.getDays(this.month).map((day) => {
            let _dateObj = {
              'year': this.year,
              'month': this.month,
              'isThisMonthDay': true,
              'day': day
            };
            if(day === this.currentDay && this.month === this.currentMonth) {
                _dateObj.isToday = true;
            }
            return _dateObj;
          }))
          .concat(
            this._getNextMonthDays(
              this.month
              , MATRIX_MAX - _needConcatLength
            ).map((nextMonthDay) => {
              return {
                'year': this.month === 12 ? this.year + 1 : this.year,
                'month': this.month === 12 ? 1 : this.month + 1,
                'day': nextMonthDay,
                'isNextMonth': true
              };
            })
          )
        }

        }
    }
  }
</script>

<style lang="scss" scoped>
  .vcom-calendar {
    width: 350px;
    height: auto;

    overflow: hidden;

    -webkit-border-radius: 10px;
    border-radius: 10px;

    -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);

    .header {
      width: 100%;
      padding: 10px 0;
      background-color: #2ecc71;
    }

    .head {
      text-align: center;
      font-size: 24px;
      padding: 10px 0;
      color: #ffffff;
      letter-spacing: 1px;

      text-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
    }

    .weeks {
      display: block;
      width: 100%;
      overflow: auto;
      padding: 10px 0;
      text-align: center;

      .week {
        width: 14.28571%;
        display: block;
        color: #ffffff;
        float: left;
        font-size: 16px;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
    }

    .days {
      width: 100%;
      height: auto;
      overflow: auto;

      background-color: #ffffff;

      position: relative;

      .day > span {
        width: 50px;
        display: block;
        float: left;
        height: 50px;
        font-size: 12px;

        text-align: center;
        line-height: 25px;

        color: #333333;
        background-color: #fefefe;
        font-weight: bold;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        border-right: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
      }

      .day {
        .this-month-day:hover{
          background-color: #e1e1e1;
          cursor: pointer;
          color: #ffffff;
        }

        .active {
          background-color: #e6e6e6;
        }

        .today {
          border-bottom: 3px solid #2ecc71;
          color: #2ecc71;
        }

        .not-this-month {
          background-color: #f9f9f9;
          color: #999999;
        }
      }
    }

    .month-select {
      cursor: pointer;
    }
  }
</style>
