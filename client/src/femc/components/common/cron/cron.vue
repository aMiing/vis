<script>
import TimePicker from './time-picker.vue';
import BlockGroup from './block-group.vue';
import Delete from './icon/delete.vue';
import Scrollbar from './scrollbar.vue';

export default {
  name: 'GCron',
  components: { TimePicker, BlockGroup, Delete, Scrollbar },
  provide() {
    return {
      updateCron: this.updateCron,
    };
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      validator(value) {
        const regExp =
          /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01]|L)(?:(?:-|\/|,)(?:0?[1-9]|[12]\d|3[01]|L))?(?:,(?:0?[1-9]|[12]\d|3[01]|L)(?:(?:-|\/|,)(?:0?[1-9]|[12]\d|3[01]|L))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[1-7])(?:(?:-|\/|,|#)(?:[1-7]))?(?:L)?(?:,(?:[1-7])(?:(?:-|\/|,|#)(?:[1-7]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|,)(?:|\d{4}))?)*))$/;
        let pass = regExp.test(value);
        return pass;
      },
    },
    singleTimePicker: {
      type: Boolean,
      default: () => false,
    },
    singleDatePicker: {
      type: Boolean,
      default: () => false,
    },
    timePickerNotEditable: {
      type: Boolean,
      default: () => false,
    },
    readonly: {
      type: Boolean,
      default: () => false,
    },
    option: {
      type: String,
      default: () => 'minute,hour,day,week,month,year',
    },
  },
  data() {
    return {
      typeList: [],
      typeLabel: '',
      data: {
        everyMinute: {
          selectedBlock: [],
        },
        everyHour: {
          timePickerList: [this.getTimePickerItem()],
        },
        everyDay: {
          timePickerList: [this.getTimePickerItem()],
        },
        everyWeek: {
          selectedBlock: [],
          timePickerList: [this.getTimePickerItem()],
        },
        everyMonth: {
          selectedBlock: [1],
          timePickerList: [this.getTimePickerItem()],
        },
        everyYear: {
          selectedBlock: [],
          timePickerList: [this.getTimePickerItem()],
        },
      },
    };
  },
  computed: {
    type() {
      return this.getTypeByLabel();
    },
  },
  watch: {
    type: {
      immediate: true,
      handler() {
        this.updateCron();
      },
    },
    value: {
      immediate: true,
      handler(value) {
        this.transformCron2Data(value);
      },
    },
    option: {
      immediate: true,
      handler(option) {
        option = option || 'minute,hour,day,week,month,year';
        const typeList = [];
        const map = {
          minute: '每分',
          hour: '每时',
          day: '每天',
          week: '每周',
          month: '每月',
          year: '每年',
        };
        option.split(',').forEach(item => {
          const key = item.trim();
          if (map[key]) {
            typeList.push(map[key]);
          }
        });

        this.typeList = typeList;
        // 如果没有值 就给初始值
        this.typeLabel = this.typeLabel || typeList[0];
      },
    },
  },
  methods: {
    getTypeByLabel() {
      let type;
      switch (this.typeLabel) {
        case '每时':
          type = 'everyHour';
          break;
        case '每天':
          type = 'everyDay';
          break;
        case '每周':
          type = 'everyWeek';
          break;
        case '每月':
          type = 'everyMonth';
          break;
        case '每年':
          type = 'everyYear';
          break;
        default:
          type = 'everyMinute';
      }

      return type;
    },
    getDefaultCron() {
      const strategy = {
        minute: '0 0/1 * * * ? *',
        hour: '0 0 * * * ? *',
        day: '0 0 0 * * ? *',
        week: '0 0 0 ? * 2 *',
        month: '0 0 0 1 * ? *',
        year: '0 0 0 1 1 ? *',
      };

      const firstOption = this.option.split(',').map(item => item.trim())[0];
      return strategy[firstOption] || strategy.minute;
    },
    transformCron2Data(value) {
      const newValue = value || this.getDefaultCron();

      const [second, minute, hour, day, month, week, year] = newValue.split(' ');

      if (minute === '*' || minute.indexOf('/') > -1) {
        this.typeLabel = '每分';
        if (minute.indexOf('/') > -1) {
          this.data.everyMinute.selectedBlock = [Number(minute.split('/')[1])];
        }
      } else if (hour === '*') {
        this.typeLabel = '每时';
      } else if (day === '*') {
        this.typeLabel = '每天';
      } else if (day === '?') {
        this.typeLabel = '每周';
        this.data.everyWeek.selectedBlock = week.split(',').map(item => Number(item));
      } else if (month === '*') {
        this.typeLabel = '每月';
        this.data.everyMonth.selectedBlock =
          day === 'L' ? [day] : day.split(',').map(item => Number(item));
      } else if (year === '*' && month !== '*') {
        this.typeLabel = '每年';
        this.data.everyMonth.selectedBlock =
          day === 'L' ? [day] : day.split(',').map(item => Number(item));
        this.data.everyYear.selectedBlock = month.split(',').map(item => Number(item));
      }

      this.transformHMS2Array(hour, minute, second);
    },
    transformHMS2Array(hour, minute, second) {
      const type = this.getTypeByLabel(this.typeLabel);
      if (type === 'everyMinute') return;
      const supply0 = num => (num < 10 ? `0${num}` : `${num}`);
      let newHour, newMinute;
      const newSecond = supply0(second);
      let data;
      if (this.type === 'everyHour') {
        newHour = '00';
        data = minute.split(',').map(val => {
          return { key: Math.random(), value: `${newHour}:${supply0(val)}:${newSecond}` };
        });
      } else {
        newMinute = supply0(minute);
        data = hour.split(',').map(val => {
          return { key: Math.random(), value: `${supply0(val)}:${newMinute}:${newSecond}` };
        });
      }

      this.data[type].timePickerList = data;
    },
    updateCron() {
      const { data: rawData, type } = this;
      const data = rawData[type];
      let cron;
      if (data) {
        const cronArr = ['*', '*', '?', '*'];
        const hms = [[], [], []];
        if (type === 'everyMinute') {
          // 每分直接更新“分”返回
          cron = `0 0/${data.selectedBlock[0] || 1} * * * ? *`;
          this.$emit('change', cron);
          return;
        }
        data.timePickerList.forEach(timePicker => {
          const timeArr = timePicker.value.split(':');
          timeArr.forEach((item, index) => {
            const time = Number(item);
            const resultItem = hms[hms.length - index - 1];
            if (!resultItem.includes(time)) resultItem.push(time);
          });
        });
        cronArr.unshift(...hms.map(arr => arr.join(',')));
        // 处理特殊情况，选择每时
        if (this.type === 'everyHour') cronArr[2] = '*';

        let weekOrMonth;
        const dayIndex = 3;
        const monthIndex = 4;
        const weekIndex = 5;
        if (data.selectedBlock) {
          weekOrMonth = data.selectedBlock.join(',');
          if (this.type === 'everyWeek') {
            cronArr[dayIndex] = '?';
            cronArr[weekIndex] = weekOrMonth || 2;
          } else if (this.type === 'everyMonth') {
            cronArr[dayIndex] = weekOrMonth || 1;
            cronArr[weekIndex] = '?';
          }
        }

        let year;
        if (rawData['everyYear'].selectedBlock) {
          year = rawData['everyYear'].selectedBlock.join(',');
        }
        if (this.type === 'everyYear') {
          cronArr[monthIndex] = year || 1;
          cronArr[dayIndex] = rawData['everyMonth'].selectedBlock || 1;
          cronArr[weekIndex] = '?';
        }
        cron = cronArr.join(' ');
      } else {
        cron = this.getDefaultCron();
      }

      if (cron !== this.value) this.$emit('change', cron);
    },
    getTimePickerItem(key = 0, value = '00:00:00') {
      return { key, value };
    },
    renderNode() {
      const list = ({ key, type }) => {
        const { timePickerList } = this.data[key];

        const handleAdd = async () => {
          const key = Math.random();
          let value;
          // 同步分钟信息
          if (this.type !== 'everyHour') {
            const hms = this.data[this.type].timePickerList[0].value;
            value = `00:${hms.slice(3, 5)}:00`;
          }

          timePickerList.push(this.getTimePickerItem(key, value));
          this.updateCron();
          await this.$nextTick();
          const ref = this.$refs.pickerWrapper;
          if (ref && !ref.$el && ref.$el.scrollTo)
            ref.$el.scrollTo({ top: ref.$el.scrollHeight, behavior: 'smooth' });
        };

        const handleDelete = index => {
          timePickerList.splice(index, 1);
          this.updateCron();
        };

        const handleMinuteChange = minute => {
          timePickerList.forEach(timePicker => {
            // 同步分钟信息
            timePicker.value = timePicker.value.replace(/(?<=:)\d{2}(?=:)/, minute);
          });
        };

        return (
          <div
            class={`g-cron__wrapper${
              this.singleTimePicker || this.timePickerNotEditable ? ' --single' : ''
            }`}
          >
            <Scrollbar ref="pickerWrapper" class="g-cron__picker-wrapper">
              {timePickerList.map((item, index) => (
                <div key={item.key} class="g-cron__row">
                  <time-picker
                    readonly={this.timePickerNotEditable || this.readonly}
                    {...{ attrs: { key, type } }}
                    vModel={timePickerList[index].value}
                    on-minute-change={handleMinuteChange}
                  />
                  {!this.timePickerNotEditable &&
                  !this.readonly &&
                  (timePickerList.length > 1 || index > 0) ? (
                    <delete nativeOnClick={() => handleDelete(index)} />
                  ) : null}
                </div>
              ))}
            </Scrollbar>
            {this.timePickerNotEditable || this.singleTimePicker || this.readonly ? null : (
              <div class="g-cron__button-wrapper">
                <el-button class="g-cron__button" plain icon="el-icon-plus" onClick={handleAdd}>
                  添加
                </el-button>
              </div>
            )}
          </div>
        );
      };

      const strategy = {
        everyMinute: () => (
          <div key="everyMinute">
            <block-group
              type="minute"
              singleSelect={true}
              readonly={this.readonly}
              vModel={this.data.everyMinute.selectedBlock}
            />
          </div>
        ),
        everyHour: () => list({ key: 'everyHour', type: 'minute' }),
        everyDay: () => list({ key: 'everyDay', type: 'hour,minute' }),
        everyWeek: () => (
          <div key="everyWeek">
            <block-group
              type="week"
              singleSelect={this.singleDatePicker}
              readonly={this.readonly}
              vModel={this.data.everyWeek.selectedBlock}
            />
            {list({ key: 'everyWeek', type: 'hour,minute' })}
          </div>
        ),
        everyMonth: () => (
          <div key="everyMonth">
            <block-group
              type="month"
              singleSelect={this.singleDatePicker}
              readonly={this.readonly}
              vModel={this.data.everyMonth.selectedBlock}
            />
            {list({ key: 'everyMonth', type: 'hour,minute' })}
          </div>
        ),
        everyYear: () => (
          <div key="everyYear">
            <block-group
              type="year"
              singleSelect={this.singleDatePicker}
              readonly={this.readonly}
              vModel={this.data.everyYear.selectedBlock}
            />
            <block-group
              type="month"
              singleSelect={this.singleDatePicker}
              readonly={this.readonly}
              vModel={this.data.everyMonth.selectedBlock}
            />
            {list({ key: 'everyYear', type: 'hour,minute' })}
          </div>
        ),
      };

      const execute = strategy[this.type] || strategy.everyMinute;

      return execute();
    },
  },
  render() {
    return (
      <div class="g-cron">
        <el-radio-group size="mini" vModel={this.typeLabel}>
          {this.typeList.map(item => (
            <el-radio-button
              key={item}
              label={item}
              disabled={this.readonly && item !== this.typeLabel}
            />
          ))}
        </el-radio-group>
        {this.renderNode()}
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.g-cron {
  &__button {
    width: 189px;

    &:focus {
      border-color: var(--grey-10, #5f7099);
    }

    &-wrapper {
      display: flex;
      height: 46px;
      border-top: 1px solid var(--grey-6, #343e61);
      align-items: center;
      justify-content: center;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    margin-top: 8px;
    margin-left: 6px;

    &:last-child {
      margin-bottom: 8px;
    }

    svg {
      margin-left: 8px;
      cursor: pointer;
      color: var(--grey-11, #9dacd1);

      &:hover {
        color: var(--blue-6, #28b0f3);
      }
    }
  }

  &__wrapper {
    margin-top: 8px;
    width: 206px;
    border: 1px solid var(--grey-6, #343e61);

    &.--single {
      border-color: transparent;

      .g-cron__row {
        margin-left: 0;
      }
    }
  }

  &__picker-wrapper {
    overflow: auto;
    max-height: 197px;
  }
}
</style>
