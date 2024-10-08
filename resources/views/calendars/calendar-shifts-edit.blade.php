@extends('app.layout')

@section('heading')
    Edit Calendar: {{ $calendar->name }}
@endsection

@section('breadcrumbs')
    {{ Breadcrumbs::render('calendars.calendar-shifts.edit', $calendar) }}
@endsection

@section('javascript')
    @parent

    @vite(['resources/js/calendar-shifts-edit.js'])
@endsection

@section('content')
    <div id="calendar-shifts">
        <calendar-shifts route="{{ route('calendars.calendar-shifts.get-calendar-shifts', $calendar) }}"
                         route-update="{{ route('calendars.calendar-shifts.update', $calendar) }}"
                         :calendar-list="{{ Js::from($calendars) }}"
        ></calendar-shifts>
    </div>
@endsection
