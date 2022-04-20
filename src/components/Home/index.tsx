import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import OakSelect from '../../oakui/wc/OakSelect';
import { newId } from '../../events/MessageService';
import StatisticsPayloadModel from '../../model/StatisticsPayloadModel';
import OakInput from '../../oakui/wc/OakInput';
import CategoryDistribution from '../DashboardElements/CategoryDistribution';
import Topbar from '../Topbar';
import './style.scss';
import BudgetTrend from '../DashboardElements/BudgetTrend';
import MonthlyCategoryTrend from '../DashboardElements/MonthlyCategoryTrend';
import {
  DASHBOARD_COLOR_SCHEME,
  DASHBOARD_KAKEIBO_COLOR_SCHEME,
  getCategoryDistribution,
  getTrend,
  getWeeklyTrend,
} from '../DashboardElements/service';
import IncomeTrend from '../DashboardElements/IncomeTrend';
import ExpenseChangeTrend from '../DashboardElements/ExpenseChangeTrend';
import WeeklyTrend from '../DashboardElements/WeeklyTrend';
import { isEmptyOrSpaces } from '../Utils';

interface Props {
  space: string;
}

const KAKEIBO_MAP = {
  Needs: { name: 'Needs' },
  Wants: { name: 'Wants' },
  Culture: { name: 'Culture' },
  Unexpected: { name: 'Unexpected' },
};

const INCOME_EXPENSE_CHART_CLASS = {
  income: { name: 'Income' },
  expense: { name: 'Expense' },
};

const Home = (props: Props) => {
  const categories = useSelector((state: any) => state.category.categories);
  const filterExpenseList = useSelector(
    (state: any) => state.filterExpense.items
  );
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());
  const [dropdown, setDropdown] = useState([
    {
      id: 'custom',
      value: 'Custom date range',
    },
  ]);

  const [state, setState] = useState<StatisticsPayloadModel>({
    option: 'custom',
    from: '2022-01',
    to: '2022-04',
  });
  const [prevState, setPrevState] = useState<StatisticsPayloadModel>({
    option: 'last month',
  });
  const [data, setData] = useState<any>({
    categoryDistribution: {},
  });
  const [weeklyTrendata, setWeeklyTrendData] = useState<any>({});

  const [categoryMap, setCategoryMap] = useState<any>({});

  useEffect(() => {
    if (authorization.isAuth && !_.isEqual(state, prevState)) {
      setPrevState({ ...state });
      if (
        state.option !== 'custom' ||
        (state.option === 'custom' &&
          !isEmptyOrSpaces(state.from) &&
          !isEmptyOrSpaces(state.to))
      ) {
        getTrend(props.space, authorization, state).then((response: any) => {
          setData(response);
        });
        getWeeklyTrend(props.space, authorization, state).then(
          (response: any) => {
            setWeeklyTrendData(response);
          }
        );
      }
    }
  }, [authorization, state]);

  useEffect(() => {
    const _dropdown = filterExpenseList?.map((item: any) => {
      return {
        id: item._id,
        value: item.name,
      };
    });
    _dropdown.push({
      id: 'custom',
      value: 'Custom date range',
    });
    setDropdown(_dropdown);
  }, [filterExpenseList]);

  useEffect(() => {
    if (categories) {
      const _categoryMap: any = {};
      categories.forEach((category: any) => {
        _categoryMap[category._id] = category;
      });
      setCategoryMap(_categoryMap);
    }
  }, [categories]);

  const handleChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: detail.value,
    });
  };

  const handleOptionChange = (
    option: 'this month' | 'last month' | 'this year' | 'last year' | 'custom'
  ) => {
    setState({
      ...state,
      option,
    });
  };

  return (
    <div className="home">
      <Topbar title="Dashboard">right</Topbar>

      <div className="main-section home__main">
        <div className="home__main__criteria">
          <OakSelect
            name="option"
            value={state.option}
            formGroupName={formId}
            handleInput={handleChange}
            size="large"
            color="container"
            placeholder="From"
            shape="rectangle"
            optionsAsKeyValue={dropdown}
          />
          {state.option === 'custom' && (
            <>
              <OakInput
                name="from"
                value={state.from}
                formGroupName={formId}
                type="month"
                handleInput={handleChange}
                size="large"
                color="container"
                placeholder="From"
                shape="rectangle"
              />
              <OakInput
                name="to"
                value={state.to}
                formGroupName={formId}
                type="month"
                handleInput={handleChange}
                size="large"
                color="container"
                placeholder="To"
                shape="rectangle"
              />
            </>
          )}
        </div>
        <div className="home__main__two-column">
          <div className="home__main__chart">
            <CategoryDistribution
              space={props.space}
              categoryMap={categoryMap}
              data={data.categoryDistribution}
              colorScheme={DASHBOARD_COLOR_SCHEME}
              title="Category distribution"
            />
          </div>
          <div className="home__main__chart">
            <MonthlyCategoryTrend
              space={props.space}
              criteria={state}
              categoryMap={categoryMap}
              data={data.categoryDistributionMonthly}
              title="Monthly category distribution"
              colorScheme={DASHBOARD_COLOR_SCHEME}
              stacked
            />
          </div>
          <div className="home__main__chart">
            <BudgetTrend
              space={props.space}
              criteria={state}
              data={data.budgetDistribution}
            />
          </div>
          <div className="home__main__chart">
            <IncomeTrend
              space={props.space}
              criteria={state}
              data={data.incomeDistributionMonthly}
            />
          </div>
          <div className="home__main__chart">
            <ExpenseChangeTrend
              space={props.space}
              criteria={state}
              data={data.totalChangeDistribution}
            />
          </div>
          <div className="home__main__chart">
            <WeeklyTrend
              space={props.space}
              criteria={state}
              data={weeklyTrendata}
            />
          </div>
          <div className="home__main__chart">
            <MonthlyCategoryTrend
              space={props.space}
              criteria={state}
              categoryMap={KAKEIBO_MAP}
              data={data.kakeiboDistributionMonthly}
              title="Monthly Kakeibo distribution"
              colorScheme={DASHBOARD_KAKEIBO_COLOR_SCHEME}
              stacked
            />
          </div>
          <div className="home__main__chart">
            <CategoryDistribution
              space={props.space}
              categoryMap={KAKEIBO_MAP}
              data={data.kakeiboDistribution}
              colorScheme={DASHBOARD_KAKEIBO_COLOR_SCHEME}
              title="Kakeibo distribution"
            />
          </div>
        </div>
        <div className="home__main__multi-column">
          <div className="">100</div>
          <div className="">200</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
