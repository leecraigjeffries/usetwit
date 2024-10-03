<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => strtolower($this->faker->domainWord . $this->faker->numberBetween(100, 999)),
            'first_name' => $this->faker->firstName,
            'middle_names' => $this->faker->optional()->firstName,
            'last_name' => $this->faker->optional()->lastName,
            'full_name' => function (array $attributes) {
                $fullName = "{$attributes['first_name']} {$attributes['middle_names']} {$attributes['last_name']}";

                return preg_replace('/\s+/', ' ', trim($fullName));
            },
            'company_number' => $this->faker->optional()->phoneNumber,
            'company_ext' => $this->faker->optional()->numerify,
            'home_number' => $this->faker->phoneNumber,
            'mobile_number' => $this->faker->phoneNumber,
            'employee_id' => $this->faker->optional()->numerify('E#####'),
            'email' => $this->faker->unique()->companyEmail,
            'home_email' => $this->faker->optional()->safeEmail,
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'emergency_name' => $this->faker->optional()->firstName,
            'emergency_number' => $this->faker->phoneNumber,
            'joined_at' => $this->faker->boolean(80) ? Carbon::parse('2024-01-01')->addDays(rand(0, 7000)) : null,
            'active' => true,
            'deleted_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
