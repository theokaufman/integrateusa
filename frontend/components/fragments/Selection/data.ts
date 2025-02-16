import { Level } from "../../../interfaces";

export const raceOptions = [
  {
    value: "norm_exp_as",
    label: "Asian",
    iso: "exp_as_as",
    non: "exp_non_as_as",
  },
  {
    value: "norm_exp_bl",
    label: "Black",
    iso: "exp_bl_bl",
    non: "exp_non_bl_bl",
  },
  {
    value: "norm_exp_hi",
    label: "Hispanic",
    iso: "exp_hi_hi",
    non: "exp_non_hi_hi",
  },
  {
    value: "norm_exp_or",
    label: "Other Race",
    iso: "exp_or_or",
    non: "exp_non_or_or",
  },
  {
    value: "norm_exp_wh",
    label: "White",
    iso: "exp_wh_wh",
    non: "exp_non_wh_wh",
  },
];

export const levelSelectData = [
  {
    value: Level.School,
    label: "School",
    route: "/api/schoolnames/?q=",
    id: "nces_id",
    name: "sch_name",
  },
  {
    value: Level.District,
    label: "District",
    route: "/api/districtnames/?q=",
    id: "dist_id",
    name: "dist_name",
  },
  {
    value: Level.County,
    label: "County",
    route: "/api/countynames/?q=",
    id: "county_id",
    name: "county_name",
  },
  {
    value: Level.State,
    label: "State",
    route: "/api/statenames/?q=",
    id: "state_abb",
    name: "state_name",
  },
];

export const yearsData = [
  { value: 2023, label: "2022-23" },
  { value: 2022, label: "2021-22" },
  { value: 2021, label: "2020-21" },
  { value: 2020, label: "2019-20" },
  { value: 2019, label: "2018-19" },
  { value: 2018, label: "2017-18" },
  { value: 2017, label: "2016-17" },
  { value: 2016, label: "2015-16" },
  { value: 2015, label: "2014-15" },
  { value: 2014, label: "2013-14" },
  { value: 2013, label: "2012-13" },
  { value: 2012, label: "2011-12" },
  { value: 2011, label: "2010-11" },
  { value: 2010, label: "2009-10" },
  { value: 2009, label: "2008-09" },
  { value: 2008, label: "2007-08" },
  { value: 2007, label: "2006-07" },
  { value: 2006, label: "2005-06" },
  { value: 2005, label: "2004-05" },
  { value: 2004, label: "2003-04" },
  { value: 2003, label: "2002-03" },
  { value: 2002, label: "2001-02" },
  { value: 2001, label: "2000-01" },
  { value: 2000, label: "1999-00" },
];

export const gradesData = [
  { value: "All", label: "All Grades", label2: "student" },
  { value: "PK", label: "Pre-K", label2: "pre-k student" },
  { value: "KG", label: "Kindergarten", label2: "kindergartener" },
  { value: "01", label: "Grade 1", label2: "first-grader" },
  { value: "02", label: "Grade 2", label2: "second-grader" },
  { value: "03", label: "Grade 3", label2: "third-grader" },
  { value: "04", label: "Grade 4", label2: "fourth-grader" },
  { value: "05", label: "Grade 5", label2: "fifth-grader" },
  { value: "06", label: "Grade 6", label2: "sixth-grader" },
  { value: "07", label: "Grade 7", label2: "seventh-grader" },
  { value: "08", label: "Grade 8", label2: "eighth-grader" },
  { value: "09", label: "Grade 9", label2: "ninth-grader" },
  { value: "10", label: "Grade 10", label2: "tenth-grader" },
  { value: "11", label: "Grade 11", label2: "eleventh-grader" },
  { value: "12", label: "Grade 12", label2: "twelvth-grader" },
  { value: "UG", label: "Ungraded", label2: "ungraded student" },
];
